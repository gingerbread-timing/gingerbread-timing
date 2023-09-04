import { db, Signup } from "@/db/dbstuff";
import { signups } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function Page({searchParams}: {
    searchParams: {success?: string, canceled?: string, id: string }
  }) {
    const signupid = parseInt(searchParams.id)
    const signup: Signup | undefined = (await db.select().from(signups).where(eq(signups.id, signupid)).limit(1)).pop()
    let message = ""
    if(signup?.paystatus === 'paid'){
        message = "Your payment has been succesfully processed and your signup is complete."
    }
    else if(searchParams.canceled) {
        message = "Your payment was canceled. You may retry payment by returning to the race page and clicking the sign up button."
    }
    else if(searchParams.success){
        await db.update(signups).set({ paystatus: 'pending' }).where(eq(signups.id, signupid));
        message = "We are currently processing your payment. You will receive an email notification when the payment is complete."
    }
    return (<div className="pagecontainer">
        {message}
        <div><Link href={`/races/${signup?.raceid}`}>Return to race page.</Link></div>
    </div>)
  }