'use server'

import { db, Race, User, Signup } from '@/db/dbstuff';
import { signups } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from "drizzle-orm";

export async function checkIn(form: FormData) {
    
    const formobj = Object.fromEntries(form);
    const raceid = parseInt(formobj.raceid as string)
    const signupid = parseInt(formobj.signupid as string)
    const racesignups: Signup[] = await db.select().from(signups).where(eq(signups.raceid,raceid));
    let bibs = racesignups.map(x => x.bibnumber);
    bibs.sort();
    
    var newbib = 0
    if(formobj.bib)
    {
      newbib = parseInt(formobj.bib as string) ?? 0;
      if(bibs.includes(newbib))
      {
        return {message: "duplicatebib"}
      }
    }
    if(newbib == 0){
      newbib = (bibs[bibs.length-1] ?? 0) + 1;
    }
    await db.update(signups)
    .set({ bibnumber: newbib })
    .where(eq(signups.id, signupid));
    revalidatePath(`/races/checkin/${raceid}`)
    return {message: "success"}
  }