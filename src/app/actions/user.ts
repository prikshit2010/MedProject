"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateUserProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const age = formData.get("age") ? parseInt(formData.get("age") as string) : null;
  const weight = formData.get("weight") ? parseInt(formData.get("weight") as string) : null;
  const height = formData.get("height") ? parseInt(formData.get("height") as string) : null;
  const address = formData.get("address") as string || null;
  const contactNo = formData.get("contactNo") as string || null;

  await db.update(users).set({
    age, weight, height, address, contactNo
  }).where(eq(users.id, userId));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}
