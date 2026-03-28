import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // @ts-expect-error known stripe versioning quirk
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Webhook Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Determine user who just bought the subscription via our injected metadata tag
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error("Empty metadata -> skipping DB upgrade.");
      return new NextResponse("User metadata missing", { status: 400 });
    }

    // Set credits artificially high to signal premium
    await db.update(users).set({
      credits: 9999,
    }).where(eq(users.id, userId));
    
    console.log(`Successfully upgraded User: ${userId}`);
  }

  // Acknowledge receipt to Stripe reliably
  return new NextResponse("OK", { status: 200 });
}
