import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";
import * as Users from "./model/users";
import * as Uploads from "./model/uploads";
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub
  ],
});

export const updateProfile = internalMutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    avatarUrlId: v.optional(v.id("_storage")),
    email: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await Users.updateUserById(ctx, {
      userId: args.userId,
      data: {
        name: args.name,
        avatarUrlId: args.avatarUrlId,
        email: args.email,
      },
    });
  },
});

export const getMe = query({
  args: {},
  returns: v.union(
    v.object({
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
      avatarUrl: v.union(v.string(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    return Users.getCurrentUser(ctx);
  },
});

export const updateMyProfile = mutation({
  args: {
    name: v.optional(v.string()),
    avatarUrlId: v.optional(v.id("_storage")),
    email: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await Users.getCurrentUser(ctx);
    if (!currentUserId) {
      throw new Error("Unauthorized: You must be signed in to update your profile");
    }

    // Use the existing updateUserById function but ensure user can only update themselves
    await Users.updateUserById(ctx, {
      userId: currentUserId._id,
      data: args,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const currentUser = await Users.getCurrentUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized: You must be signed in to upload images");
    }

    return Uploads.generateUploadUrl(ctx);
  },
});