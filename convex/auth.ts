import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";
import * as Users from "./model/users";
import * as Uploads from "./model/uploads";
import { query, mutation, internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
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
  handler: async (ctx) => {
    const currentUser = await Users.getCurrentUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized: You must be signed in to upload images");
    }

    return Uploads.generateUploadUrl(ctx);
  },
});