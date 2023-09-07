import { db } from '@/db/dbstuff';
import { races } from '@/db/schema';
import { NextResponse } from 'next/server';
import { adminRestrict } from '@/servertools';
import { eq } from 'drizzle-orm';
import { sanitizeFormDate } from '@/clienttools';

export async function POST(request: Request) {
    await adminRestrict()
    //convert the incoming form request to a usable object
    const data = await request.formData();
    const form = Object.fromEntries(data);
    const raceid = parseInt(String(form.raceid))
    const starttime = sanitizeFormDate(form.starttime)
    const endtime = sanitizeFormDate(form.endtime)

    //parse the form data into the corresponding db ORM fields
    await db.update(races).set({name: String(form.name), routeURL: String(form.routeurl), heroURL: String(form.herourl), starttime: starttime, endtime: endtime, length: parseInt(String(form.length)), description: String(form.description), contactemail: String(form.contactemail)}).where(eq(races.id , raceid))

    return NextResponse.redirect(new URL(`/races/${raceid}`, request.url), 302);
}



  