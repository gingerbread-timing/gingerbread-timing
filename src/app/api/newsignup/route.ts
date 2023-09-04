import { db, NewSignup } from '@/db/dbstuff';
import { races, signups } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import Stripe from "stripe";
const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]!, {typescript: true, apiVersion: "2023-08-16"});

export async function POST(request: Request) {
    //convert the incoming form request to a usable object
    const data = await request.formData();
    const form = Object.fromEntries(data);
    const userid = Number(form.userid)
    const raceid = Number(form.raceid)

    const signup = await db.select().from(signups).where(eq(signups.raceid, raceid)).where(eq(signups.userid, userid))
    if(!signup[0]){
        const entry: NewSignup = {userid: userid, raceid: raceid, signupdate: new Date(), paystatus: 'unpaid'};
        await db.insert(signups).values(entry);
    }
    const race = await db.select().from(races).where(eq(races.id, raceid))

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price_data: {
                currency: "usd",
                product_data: {
                    name: `${race[0].name} Sign Up Fee`, //RACE NAME
                    metadata:{
                        userid: userid, //userid here
                        raceid: raceid, //raceid here
                    }
                },
                unit_amount: 100 //PRICE HERE
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env["AUTH0_BASE_URL"]}/?success=true`,
        cancel_url: `${process.env["AUTH0_BASE_URL"]}/?canceled=true`,
      });
      return NextResponse.redirect(session.url!, 302);
}

  