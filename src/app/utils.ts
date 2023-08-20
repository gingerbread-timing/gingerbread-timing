import { db, User } from './db/dbstuff';
import { users } from '@/db/schema';
import { eq } from "drizzle-orm";
import { redirect } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';

//get a user from our user table based on an authenticated email address from zeroauth
export async function getInternalUser(){
    const session = await getSession();
    const authUser = session?.user;

    const result = await db.select().from(users).where(eq(users.email, authUser?.email));
    const internalUser = result[0];
    //if we have a valid authentication but don't find the user in our DB, redirect to the new user form
    if(!internalUser) {
      redirect('/newuser');
    }
    return internalUser;
}

export function getUserAge(user: User)
{
  var today = new Date();
    var birthDate = user.birthday;
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function getStringDate(date?: Date){
  if(!date) {return 'INVALID DATE'}
  return `${date?.getMonth()}/${date?.getDate()}/${date?.getFullYear()}`
}

export function getStringTime(date?: Date){
  if(!date) {return 'INVALID DATE'}
  let hour = date?.getHours();
  let ampm = "AM"
  if(hour > 12){
    hour -= 12
    ampm = "PM"
  }
  return `${hour}:${String(date?.getMinutes()).padStart(2,'0')} ${ampm}`;
}