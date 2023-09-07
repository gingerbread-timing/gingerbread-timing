import { db, NewRace } from '@/db/dbstuff';
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
    const starttime = sanitizeFormDate(form.starttime)
    const endtime = sanitizeFormDate(form.endtime)

    //parse the form data into the corresponding db ORM fields
    const entry: NewRace = {name: String(form.name), routeURL: String(form.routeurl), heroURL: String(form.herourl), starttime: starttime, endtime: endtime, length: parseInt(String(form.length)), description: String(form.description), contactemail: String(form.contactemail)};

    await db.insert(races).values(entry);
    const madeRace = (await db.select().from(races).where(eq(races.name, entry.name))).pop()

    //redirect to the landing page; change the string literal for other site locations
    return NextResponse.redirect(new URL(`/races/newrace/created?raceid=${madeRace?.id}`, request.url), 302);
}

  