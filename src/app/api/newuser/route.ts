import { db, NewUser } from '@/db/dbstuff';
import { users } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    //convert the incoming form request to a usable object
    const data = await request.formData();
    const form = Object.fromEntries(data);
    const birthday = new Date(String(form.birthday));
    const finalbirthday = new Date(birthday.getTime() + 1);

    //parse the form data into the corresponding db ORM fields
    const entry: NewUser = {firstname: String(form.firstname), lastname: String(form.lastname), email: String(form.email), birthday: finalbirthday, gender: String(form.gender), phone: String(form.phone), address: String(form.address), country: String(form.country), zip: String(form.zip), city: String(form.city), state: String(form.state), emergencyname: String(form.emergencyname), emergencyphone: String(form.emergencyphone), createdAt: new Date()};

    await db.insert(users).values(entry);

    //redirect to the user list; change the string literal for other site locations 
    return NextResponse.redirect(new URL('/', request.url), 302);
}

  