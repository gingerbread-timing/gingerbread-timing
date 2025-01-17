import { db, NewSignup } from '@/db/dbstuff';
import { events, races, signups } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import Stripe from "stripe";
const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]!, {typescript: true, apiVersion: "2023-08-16"});

export async function POST(request: Request) {
    //convert the incoming form request to a usable object
    const data = await request.formData();
    const form = Object.fromEntries(data);
    const userid = Number(form.userid)
    const raceid = Number(form.raceid)
    const eventid = Number(form.eventid)
    const event = (await db.select().from(events).where(eq(events.id, eventid)).limit(1)).pop()
    let signup = (await db.select().from(signups).where(and(eq(signups.raceid, raceid),eq(signups.userid, userid))).limit(1)).pop()
    console.log(signup)
    console.log(raceid)
    if(!signup){
        const entry: NewSignup = {userid: userid, raceid: raceid, eventid: eventid, signupdate: new Date(), paystatus: 'unpaid'};
        await db.insert(signups).values(entry);
        signup = (await db.select().from(signups).where(and(eq(signups.raceid, raceid),eq(signups.userid, userid)))).pop()
    }
    const race = (await db.select().from(races).where(eq(races.id, raceid)).limit(1)).pop()

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price_data: {
                currency: "usd",
                product_data: {
                    name: `${race!.name} - ${event!.name} Sign Up Fee`,
                },
                unit_amount: event!.price * 100 
            },
            quantity: 1,
          },
        ],
        metadata:{
            signupid: signup!.id
        },
        mode: 'payment',
        success_url: `${process.env["AUTH0_BASE_URL"]}/races/paymentoutcome/?success=true&id=${signup!.id}`,
        cancel_url: `${process.env["AUTH0_BASE_URL"]}/races/paymentoutcome/?canceled=true&id=${signup!.id}`,
      });
      return NextResponse.redirect(session.url!, 302);
}

  