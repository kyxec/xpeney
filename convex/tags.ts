import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

// Helper function to check user permissions for a tag
async function checkTagPermissions(ctx: QueryCtx | MutationCtx, tagId: Id<"tags">, userId: Id<"users">) {
  const tag = await ctx.db.get(tagId);
  if (!tag) {
    throw new Error("Tag not found");
  }

  const isOwner = tag.ownerId === userId;
  let permission: string | null = isOwner ? "owner" : null;

  if (!isOwner) {
    const share = await ctx.db
      .query("tagShares")
      .withIndex("by_tagId_and_sharedWithUserId", (q) => q.eq("tagId", tagId).eq("sharedWithUserId", userId))
      .first();

    permission = share?.permission || null;
  }

  return { tag, isOwner, permission };
}

// Create a new tag
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    isPrivate: v.boolean(),
  },
  returns: v.id("tags"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Validate and sanitize name
    const name = args.name.trim();
    if (!name || name.length < 2) {
      throw new Error("Tag name must be at least 2 characters");
    }
    if (name.length > 50) {
      throw new Error("Tag name must be less than 50 characters");
    }

    // Check if tag name already exists for this user
    const existingTag = await ctx.db
      .query("tags")
      .withIndex("by_name_and_ownerId", (q) => q.eq("name", name).eq("ownerId", userId))
      .first();

    if (existingTag) {
      throw new Error("Tag with this name already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("tags", {
      name,
      description: args.description?.trim() || undefined,
      color: args.color || "#6b7280", // Default gray color
      ownerId: userId,
      isPrivate: args.isPrivate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all tags for the current user (owned + shared) with server-side filtering and sorting
export const list = query({
  args: {
    includeShared: v.optional(v.boolean()),
    search: v.optional(v.string()),
    sort: v.optional(v.union(v.literal("name"), v.literal("date"), v.literal("usage"))),
    order: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  returns: v.array(
    v.object({
      _id: v.id("tags"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.optional(v.string()),
      color: v.optional(v.string()),
      ownerId: v.id("users"),
      isPrivate: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
      shareCount: v.optional(v.number()),
      isOwner: v.boolean(),
      permission: v.optional(v.string()),
      sharedBy: v.optional(v.object({
        _id: v.id("users"),
        _creationTime: v.number(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        avatarUrlId: v.optional(v.id("_storage")),
      })),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all owned tags
    const ownedTags = await ctx.db
      .query("tags")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
      .collect();

    // Get shared tags if requested
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharedTags: Array<any> = [];
    if (args.includeShared) {
      const tagShares = await ctx.db
        .query("tagShares")
        .withIndex("by_sharedWithUserId", (q) => q.eq("sharedWithUserId", userId))
        .collect();

      for (const share of tagShares) {
        const tag = await ctx.db.get(share.tagId);
        if (tag) {
          sharedTags.push({
            ...tag,
            permission: share.permission,
            sharedBy: await ctx.db.get(share.sharedByUserId),
            isOwner: false,
          });
        }
      }
    }

    // Add share count and owner flag for owned tags
    const tagsWithMetadata = await Promise.all(
      ownedTags.map(async (tag) => {
        const shareCount = await ctx.db
          .query("tagShares")
          .withIndex("by_tagId", (q) => q.eq("tagId", tag._id))
          .collect();

        return {
          ...tag,
          shareCount: shareCount.length,
          isOwner: true,
        };
      })
    );

    let allTags = [...tagsWithMetadata, ...sharedTags];

    // Server-side search filtering
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      allTags = allTags.filter(tag =>
        tag.name.toLowerCase().includes(searchLower) ||
        (tag.description && tag.description.toLowerCase().includes(searchLower))
      );
    }

    // Server-side sorting
    const sortBy = args.sort || "name";
    const sortOrder = args.order || "asc";

    allTags.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = (a.createdAt || a._creationTime) - (b.createdAt || b._creationTime);
          break;
        case "usage":
          comparison = (a.shareCount || 0) - (b.shareCount || 0);
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return allTags;
  },
});

// Update a tag
export const update = mutation({
  args: {
    id: v.id("tags"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { tag, permission } = await checkTagPermissions(ctx, args.id, userId);

    if (permission !== "owner" && permission !== "editor") {
      throw new Error("Insufficient permissions to edit this tag");
    }

    // If changing name, validate and check for duplicates
    if (args.name !== undefined) {
      const name = args.name.trim();
      if (!name || name.length < 2) {
        throw new Error("Tag name must be at least 2 characters");
      }
      if (name.length > 50) {
        throw new Error("Tag name must be less than 50 characters");
      }

      if (name !== tag.name) {
        const existingTag = await ctx.db
          .query("tags")
          .withIndex("by_name_and_ownerId", (q) => q.eq("name", name).eq("ownerId", tag.ownerId))
          .first();

        if (existingTag && existingTag._id !== args.id) {
          throw new Error("Tag with this name already exists");
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = { updatedAt: Date.now() };
    if (args.name !== undefined) updateData.name = args.name.trim();
    if (args.description !== undefined) updateData.description = args.description?.trim() || undefined;
    if (args.color !== undefined) updateData.color = args.color;
    if (args.isPrivate !== undefined) updateData.isPrivate = args.isPrivate;

    await ctx.db.patch(args.id, updateData);
    return null;
  },
});

// Delete a tag
export const remove = mutation({
  args: { id: v.id("tags") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const tag = await ctx.db.get(args.id);
    if (!tag) {
      throw new Error("Tag not found");
    }

    if (tag.ownerId !== userId) {
      throw new Error("Only the tag owner can delete it");
    }

    // Delete all shares for this tag
    const shares = await ctx.db
      .query("tagShares")
      .withIndex("by_tagId", (q) => q.eq("tagId", args.id))
      .collect();

    for (const share of shares) {
      await ctx.db.delete(share._id);
    }

    // Remove tag from all expenses
    for await (const expense of ctx.db.query("expenses")) {
      if (expense.tagIds.includes(args.id)) {
        const updatedTagIds = expense.tagIds.filter((tagId) => tagId !== args.id);
        await ctx.db.patch(expense._id, {
          tagIds: updatedTagIds,
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

// Share a tag with another user
export const share = mutation({
  args: {
    tagId: v.id("tags"),
    userEmail: v.string(),
    permission: v.union(v.literal("viewer"), v.literal("editor")),
  },
  returns: v.id("tagShares"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const tag = await ctx.db.get(args.tagId);
    if (!tag) {
      throw new Error("Tag not found");
    }

    if (tag.ownerId !== userId) {
      throw new Error("Only the tag owner can share it");
    }

    // Find the user to share with
    const targetUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.userEmail))
      .first();

    if (!targetUser) {
      throw new Error("User not found");
    }

    if (targetUser._id === userId) {
      throw new Error("Cannot share tag with yourself");
    }

    // Check if already shared
    const existingShare = await ctx.db
      .query("tagShares")
      .withIndex("by_tagId_and_sharedWithUserId", (q) => q.eq("tagId", args.tagId).eq("sharedWithUserId", targetUser._id))
      .first();

    if (existingShare) {
      // Update existing share
      await ctx.db.patch(existingShare._id, {
        permission: args.permission,
      });
      return existingShare._id;
    }

    // Create new share
    return await ctx.db.insert("tagShares", {
      tagId: args.tagId,
      sharedWithUserId: targetUser._id,
      sharedByUserId: userId,
      permission: args.permission,
      createdAt: Date.now(),
    });
  },
});

// Remove sharing for a tag
export const unshare = mutation({
  args: {
    tagId: v.id("tags"),
    userId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    const tag = await ctx.db.get(args.tagId);
    if (!tag) {
      throw new Error("Tag not found");
    }

    if (tag.ownerId !== currentUserId) {
      throw new Error("Only the tag owner can manage sharing");
    }

    const share = await ctx.db
      .query("tagShares")
      .withIndex("by_tagId_and_sharedWithUserId", (q) => q.eq("tagId", args.tagId).eq("sharedWithUserId", args.userId))
      .first();

    if (!share) {
      throw new Error("Share not found");
    }

    await ctx.db.delete(share._id);
    return null;
  },
});

// Get sharing details for a tag
export const getShares = query({
  args: { tagId: v.id("tags") },
  returns: v.array(
    v.object({
      _id: v.id("tagShares"),
      _creationTime: v.number(),
      tagId: v.id("tags"),
      sharedWithUserId: v.id("users"),
      sharedByUserId: v.id("users"),
      permission: v.union(v.literal("viewer"), v.literal("editor")),
      createdAt: v.number(),
      user: v.union(
        v.object({
          _id: v.id("users"),
          name: v.optional(v.string()),
          email: v.optional(v.string()),
        }),
        v.null()
      ),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const tag = await ctx.db.get(args.tagId);
    if (!tag) {
      return [];
    }

    // Only owner can see sharing details
    if (tag.ownerId !== userId) {
      return [];
    }

    const shares = await ctx.db
      .query("tagShares")
      .withIndex("by_tagId", (q) => q.eq("tagId", args.tagId))
      .collect();

    return await Promise.all(
      shares.map(async (share) => {
        const user = await ctx.db.get(share.sharedWithUserId);
        return {
          ...share,
          user: user ? { _id: user._id, name: user.name, email: user.email } : null,
        };
      })
    );
  },
});