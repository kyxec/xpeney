import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        avatarUrlId: v.optional(v.id("_storage")),
    })
        .index("email", ["email"])
        .index("phone", ["phone"]),

    // Tags table
    tags: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        color: v.optional(v.string()),
        ownerId: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_ownerId", ["ownerId"])
        .index("by_name_and_ownerId", ["name", "ownerId"])
        .searchIndex("search_name", { searchField: "name" }),

    // Tag sharing permissions
    tagShares: defineTable({
        tagId: v.id("tags"),
        sharedWithUserId: v.id("users"),
        sharedByUserId: v.id("users"),
        permission: v.union(v.literal("viewer"), v.literal("editor")),
        createdAt: v.number(),
    })
        .index("by_tagId", ["tagId"])
        .index("by_sharedWithUserId", ["sharedWithUserId"])
        .index("by_tagId_and_sharedWithUserId", ["tagId", "sharedWithUserId"]),

    // Tag invitations
    tagInvitations: defineTable({
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
    })
        .index("by_tagId", ["tagId"])
        .index("by_invitedEmail", ["invitedEmail"])
        .index("by_invitedByUserId", ["invitedByUserId"])
        .index("by_status", ["status"])
        .index("by_invitedEmail_and_status", ["invitedEmail", "status"]),

    // Expenses table
    expenses: defineTable({
        amount: v.number(),
        description: v.string(),
        date: v.number(),
        ownerId: v.id("users"),
        tagIds: v.array(v.id("tags")),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_ownerId", ["ownerId"])
        .index("by_date", ["date"])
        .index("by_ownerId_and_date", ["ownerId", "date"]),
});

export default schema;