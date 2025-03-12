"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export async function createPost(content, image) {
    try {
        const userId = await getDbUserId();

        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId
            }
        })

        revalidatePath("/") // purge the cache for the home page
        return { success: true, post }
    } catch (error) {
        console.log("Failed to create post:", error)
        return { success: false, error: "Failed to create post" };
    }
}