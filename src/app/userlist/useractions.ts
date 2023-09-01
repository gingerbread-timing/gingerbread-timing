'use server'
import { db } from "@/db/dbstuff";
import { admins, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function ModifyAdmin(email: string){
    const adminresult = await db.select().from(admins);
    const adminemails = adminresult.map((admin) => admin.email)
    if(!adminemails.includes(email)){
        await db.insert(admins).values({email: email});
    }
    else{
        await db.delete(admins).where(eq(admins.email, email))
    }
    revalidatePath('/userlist')
}

export async function DeleteUser(userid: number){
    await db.delete(users).where(eq(users.id, userid))
    revalidatePath('/userlist')
}