'use server'
import { db, NewEvent } from "@/db/dbstuff"
import { events } from "@/db/schema"
import { revalidatePath } from "next/cache";
export async function SubmitNewEvent(formData: FormData){
    const raceid = parseInt(String(formData.get("raceid")))
    const event: NewEvent = {name: String(formData.get("name")), price: parseInt(String(formData.get("price"))), raceid: raceid};

    await db.insert(events).values(event);
    revalidatePath(`/races/${raceid}`)
}