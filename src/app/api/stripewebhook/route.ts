import Stripe from "stripe";
import { db } from "@/db/dbstuff";
import { signups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers"
import { any } from "prop-types";
const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]!, {typescript: true, apiVersion: "2023-08-16"});

export async function POST(request: Request) {
    const body = await request.text()
    const signature = headers().get('stripe-signature')
    let event:Stripe.Event
    event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env["STRIPE_ENDPOINT_SECRET"]!
    );
    console.log(body)
    switch(event.type){
        case 'checkout.session.completed':
            const checkobj: {metadata?: any} = event.data.object
            const checkmeta = checkobj.metadata
            console.log(checkmeta.signupid)
            await db.update(signups).set({ paystatus: 'paid' }).where(eq(signups.id, checkmeta.signupid));
            break;
    }
    return new NextResponse(`ok`, { status: 200 })
}
  