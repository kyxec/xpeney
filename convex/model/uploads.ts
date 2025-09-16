import { MutationCtx } from "../_generated/server";


export async function generateUploadUrl(ctx: MutationCtx) {
    return await ctx.storage.generateUploadUrl();
}