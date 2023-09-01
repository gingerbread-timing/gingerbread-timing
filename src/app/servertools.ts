import { User, db } from './db/dbstuff';
import { users, admins } from '@/db/schema';
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
    return internalUser ?? null;
}

export async function requireInternalUser(){
  const internalUser = await getInternalUser()
  if(!internalUser) {
    redirect('/newuser');
  }
  return internalUser
}

export async function adminRestrict(){
  const user = await requireInternalUser()
  if(!userIsAdmin(user)) redirect('/')
  else return user
}

export async function userIsAdmin(user: User){
  const adminresult = await db.select().from(admins);
  const adminemails = adminresult.map((admin) => admin.email)
  if(adminemails.includes(user?.email)) return true
  return false
}