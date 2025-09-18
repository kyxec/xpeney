import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

// Helper function to check if user is the tag owner
async function checkTagOwnership(ctx: QueryCtx | MutationCtx, tagId: Id<"tags">, userId: Id<"users">) {
    const tag = await ctx.db.get(tagId);
    if (!tag) {
        throw new Error("Tag not found");
    }

    if (tag.ownerId !== userId) {
        throw new Error("Only tag owners can send invitations");
    }

    return tag;
}

// Create a new tag invitation
export const createInvitation = mutation({
    args: {
        tagId: v.id("tags"),
        invitedEmail: v.string(),
        permission: v.union(v.literal("viewer"), v.literal("editor")),
        message: v.optional(v.string()),
    },
    returns: v.id("tagInvitations"),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(args.invitedEmail)) {
            throw new Error("Invalid email address");
        }

        // Check if user owns the tag
        const tag = await checkTagOwnership(ctx, args.tagId, userId);

        // Check if user exists and is already shared with
        const invitedUser = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.invitedEmail))
            .first();

        if (invitedUser) {
            // Check if already shared
            const existingShare = await ctx.db
                .query("tagShares")
                .withIndex("by_tagId_and_sharedWithUserId", (q) =>
                    q.eq("tagId", args.tagId).eq("sharedWithUserId", invitedUser._id))
                .first();

            if (existingShare) {
                throw new Error("Tag is already shared with this user");
            }
        }

        // Check if invitation already exists and is pending
        const existingInvitation = await ctx.db
            .query("tagInvitations")
            .withIndex("by_invitedEmail_and_status", (q) =>
                q.eq("invitedEmail", args.invitedEmail).eq("status", "pending"))
            .filter((q) => q.eq(q.field("tagId"), args.tagId))
            .first();

        if (existingInvitation) {
            throw new Error("A pending invitation already exists for this email");
        }

        const now = Date.now();
        const expiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days from now

        return await ctx.db.insert("tagInvitations", {
            tagId: args.tagId,
            invitedEmail: args.invitedEmail.toLowerCase().trim(),
            invitedByUserId: userId,
            permission: args.permission,
            status: "pending",
            message: args.message?.trim(),
            expiresAt,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// List pending invitations for the current user's email
export const listPendingInvitations = query({
    args: {},
    returns: v.array(
        v.object({
            _id: v.id("tagInvitations"),
            _creationTime: v.number(),
            tagId: v.id("tags"),
            invitedEmail: v.string(),
            invitedByUserId: v.id("users"),
            permission: v.union(v.literal("viewer"), v.literal("editor")),
            status: v.union(
                v.literal("pending"),
                v.literal("accepted"),
                v.literal("declined"),
                v.literal("expired")
            ),
            message: v.optional(v.string()),
            expiresAt: v.number(),
            createdAt: v.number(),
            updatedAt: v.number(),
            tag: v.object({
                _id: v.id("tags"),
                _creationTime: v.number(),
                name: v.string(),
                description: v.optional(v.string()),
                color: v.optional(v.string()),
                ownerId: v.id("users"),
                createdAt: v.number(),
                updatedAt: v.number(),
            }),
            invitedBy: v.object({
                _id: v.id("users"),
                _creationTime: v.number(),
                name: v.optional(v.string()),
                image: v.optional(v.string()),
                email: v.optional(v.string()),
            }),
        })
    ),
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Get current user to check their email
        const currentUser = await ctx.db.get(userId);
        if (!currentUser?.email) {
            return [];
        }

        const now = Date.now();

        // Get pending invitations for this user's email
        const invitations = await ctx.db
            .query("tagInvitations")
            .withIndex("by_invitedEmail_and_status", (q) =>
                q.eq("invitedEmail", currentUser.email!).eq("status", "pending"))
            .filter((q) => q.gt(q.field("expiresAt"), now)) // Not expired
            .collect();

        // Fetch related data
        const result = await Promise.all(
            invitations.map(async (invitation) => {
                const [tag, invitedBy] = await Promise.all([
                    ctx.db.get(invitation.tagId),
                    ctx.db.get(invitation.invitedByUserId),
                ]);

                if (!tag || !invitedBy) {
                    return null;
                }

                return {
                    ...invitation,
                    tag,
                    invitedBy,
                };
            })
        );

        return result.filter((item) => item !== null);
    },
});

// Accept an invitation
export const acceptInvitation = mutation({
    args: {
        invitationId: v.id("tagInvitations"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const invitation = await ctx.db.get(args.invitationId);
        if (!invitation) {
            throw new Error("Invitation not found");
        }

        // Get current user to verify email
        const currentUser = await ctx.db.get(userId);
        if (!currentUser?.email || currentUser.email !== invitation.invitedEmail) {
            throw new Error("This invitation is not for your email address");
        }

        if (invitation.status !== "pending") {
            throw new Error("Invitation is no longer pending");
        }

        if (invitation.expiresAt < Date.now()) {
            throw new Error("Invitation has expired");
        }

        // Check if already shared (race condition protection)
        const existingShare = await ctx.db
            .query("tagShares")
            .withIndex("by_tagId_and_sharedWithUserId", (q) =>
                q.eq("tagId", invitation.tagId).eq("sharedWithUserId", userId))
            .first();

        if (existingShare) {
            // Update invitation as accepted even if share already exists
            await ctx.db.patch(args.invitationId, {
                status: "accepted",
                respondedAt: Date.now(),
                updatedAt: Date.now(),
            });
            return;
        }

        // Create the tag share
        await ctx.db.insert("tagShares", {
            tagId: invitation.tagId,
            sharedWithUserId: userId,
            sharedByUserId: invitation.invitedByUserId,
            permission: invitation.permission,
            createdAt: Date.now(),
        });

        // Update invitation status
        await ctx.db.patch(args.invitationId, {
            status: "accepted",
            respondedAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Decline an invitation
export const declineInvitation = mutation({
    args: {
        invitationId: v.id("tagInvitations"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const invitation = await ctx.db.get(args.invitationId);
        if (!invitation) {
            throw new Error("Invitation not found");
        }

        // Get current user to verify email
        const currentUser = await ctx.db.get(userId);
        if (!currentUser?.email || currentUser.email !== invitation.invitedEmail) {
            throw new Error("This invitation is not for your email address");
        }

        if (invitation.status !== "pending") {
            throw new Error("Invitation is no longer pending");
        }

        // Update invitation status
        await ctx.db.patch(args.invitationId, {
            status: "declined",
            respondedAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// List invitations sent by the current user
export const listSentInvitations = query({
    args: {
        tagId: v.optional(v.id("tags")),
    },
    returns: v.array(
        v.object({
            _id: v.id("tagInvitations"),
            _creationTime: v.number(),
            tagId: v.id("tags"),
            invitedEmail: v.string(),
            invitedByUserId: v.id("users"),
            permission: v.union(v.literal("viewer"), v.literal("editor")),
            status: v.union(
                v.literal("pending"),
                v.literal("accepted"),
                v.literal("declined"),
                v.literal("expired")
            ),
            message: v.optional(v.string()),
            expiresAt: v.number(),
            createdAt: v.number(),
            updatedAt: v.number(),
            respondedAt: v.optional(v.number()),
            tag: v.optional(
                v.object({
                    _id: v.id("tags"),
                    _creationTime: v.number(),
                    name: v.string(),
                    description: v.optional(v.string()),
                    color: v.optional(v.string()),
                    ownerId: v.id("users"),
                    createdAt: v.number(),
                    updatedAt: v.number(),
                })
            ),
        })
    ),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        let invitations;
        if (args.tagId) {
            invitations = await ctx.db
                .query("tagInvitations")
                .withIndex("by_tagId", (q) => q.eq("tagId", args.tagId!))
                .filter((q) => q.eq(q.field("invitedByUserId"), userId))
                .collect();
        } else {
            invitations = await ctx.db
                .query("tagInvitations")
                .withIndex("by_invitedByUserId", (q) => q.eq("invitedByUserId", userId))
                .collect();
        }

        // If no tagId filter, fetch tag info for each invitation
        if (!args.tagId) {
            const result = await Promise.all(
                invitations.map(async (invitation) => {
                    const tag = await ctx.db.get(invitation.tagId);
                    return {
                        ...invitation,
                        tag: tag || undefined,
                    };
                })
            );
            return result;
        }

        return invitations.map((invitation) => ({ ...invitation, tag: undefined }));
    },
});

// Cancel a pending invitation (only by sender)
export const cancelInvitation = mutation({
    args: {
        invitationId: v.id("tagInvitations"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const invitation = await ctx.db.get(args.invitationId);
        if (!invitation) {
            throw new Error("Invitation not found");
        }

        if (invitation.invitedByUserId !== userId) {
            throw new Error("You can only cancel invitations you sent");
        }

        if (invitation.status !== "pending") {
            throw new Error("Can only cancel pending invitations");
        }

        await ctx.db.delete(args.invitationId);
    },
});