import Stripe from "stripe";
import { db } from "@/db/dbstuff";
import { signups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers"
const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]!, {typescript: true, apiVersion: "2023-08-16"});
const endpointSecret = "whsec_766ced8baab2bde9f5277287db3ba6708ef46f2c01a32c873fd1a4f04ccd553a"

export async function POST(request: Request) {
    const body = await request.text()
    const signature = headers().get('stripe-signature')
    let event:Stripe.Event
    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature!,
            endpointSecret
        );
    }
    catch (error){
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }
    console.log(body)
    switch(event.type){
        case 'checkout.session.completed':
            console.log("META PULL")
            const checkmeta = event.data.object.metadata
            console.log(checkmeta.signupid)
            await db.update(signups).set({ paystatus: 'paid' }).where(eq(signups.id, checkmeta.signupid));
    }
    return new NextResponse(`ok`, { status: 200 })
}
  