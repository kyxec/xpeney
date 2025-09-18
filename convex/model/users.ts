import { Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';
import { getAuthUserId } from "@convex-dev/auth/server";

// Define a more complete user update type
type UserUpdateData = {
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
    avatarUrlId?: Id<"_storage">;
    emailVerificationTime?: number;
    phoneVerificationTime?: number;
    isAnonymous?: boolean;
};

export async function getCurrentUser(ctx: QueryCtx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const avatarUrl = user.avatarUrlId ? await ctx.storage.getUrl(user.avatarUrlId) : null;

    return {
        ...user,
        avatarUrl,
    }
}

export async function updateUserById(
    ctx: MutationCtx,
    { userId, data }: { userId: Id<"users">, data: Partial<UserUpdateData> }
) {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
        throw new Error("Unauthorized: User not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Build object with only changed fields
    const updates: Partial<UserUpdateData> = {};

    // Check and update name if changed
    if (data.name !== undefined && data.name !== user.name) {
        updates.name = data.name;
    }

    // Check and update avatarUrlId if changed
    if (data.avatarUrlId !== undefined && data.avatarUrlId !== user.avatarUrlId) {
        updates.avatarUrlId = data.avatarUrlId;
    }

    // Check and update email if changed
    if (data.email !== undefined && data.email !== user.email) {
        const emailExists = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", data.email)).first();
        if (emailExists && emailExists._id !== userId) {
            throw new Error("Email already in use");
        }
        updates.email = data.email;
    }

    // Add any other fields that might have changed
    for (const [key, value] of Object.entries(data)) {
        if (key !== 'name' && key !== 'avatarUrlId' && key !== 'email' &&
            value !== undefined && value !== (user as Record<string, unknown>)[key]) {
            (updates as Record<string, unknown>)[key] = value;
        }
    }

    // Only patch if there are actual changes
    if (Object.keys(updates).length > 0) {
        await ctx.db.patch(userId, updates);
    }
}