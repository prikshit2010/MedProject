import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // @ts-expect-error known stripe versioning quirk
  apiVersion: "2024-06-20",
});

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // We get the PRICE_ID from env
    const priceId = process.env.STRIPE_PRICE_ID;
    
    if (!priceId) {
      return new NextResponse("STRIPE_PRICE_ID missing in env", { status: 500 });
    }

    const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${host}/dashboard?success=true`,
      cancel_url: `${host}/pricing?canceled=true`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId, // Critical: this tells our webhook WHO just paid
      },
    });

    if (stripeSession.url) {
      // If triggered from HTML form action, we redirect 303.
      return NextResponse.redirect(stripeSession.url, 303);
    }
    
    return new NextResponse("Failed to create session", { status: 500 });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
