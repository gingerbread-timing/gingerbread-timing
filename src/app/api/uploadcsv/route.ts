import { db, NewSignup, NewUser} from '@/db/dbstuff';
import { events, signups, users } from '@/db/schema';
import { NextResponse } from 'next/server';
import neatCsv from 'neat-csv';
import { desc, eq } from "drizzle-orm";

export async function POST(request: Request) {
    //convert the incoming form request to a usable object
    const data = await request.formData();
    const form = Object.fromEntries(data);
    const raceid = parseInt(form.raceid as string);
    const file: File | null = form.csv as unknown as File
    if (!file) {
        return NextResponse.json({ success: false })
      }
    //read from the uploaded file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    //pull csv from file and parse it into object
    const parsed = await neatCsv(buffer,{skipLines: 1});
    
    const userlist = await db.select().from(users).orderBy(desc(users.id)).limit(1);
    let newid = userlist[0].id ?? 0;
    let resultusers = [] as NewUser[]
    let newplacements = [] as NewSignup[]
    
    let timings = [] as {signupid: number, time: number}[]
    const signedup = await db.select().from(signups).where(eq(signups.raceid, raceid))

    for(var entry of parsed){
        const newbib = parseInt(entry["Bib"])
        const usertiming = clockToSeconds(entry["Clock Time"])
        //check if signups contain bib number- if so, attach timing to signup
        const bibmatch = signedup.filter(sign => {return sign.bibnumber === newbib})
        if(bibmatch[0]){
            if(!usertiming) continue
            timings.push({signupid: bibmatch[0].id, time: usertiming})
            continue
        }
        //otherwise, generate a new user and signup
        newid++;
        let resultuser = {} as NewUser
        const splitname = entry["Name"].split(" ");
        resultuser.firstname = splitname[0]
        resultuser.lastname = splitname[1]
        resultuser.email = "CSV USER"
        let fakebirthday = new Date()
        const age = parseInt(entry["Age"]);
        fakebirthday.setFullYear(fakebirthday.getFullYear()-age);
        resultuser.birthday = fakebirthday;
        resultuser.gender = entry["Gender"]

        let placement = {} as NewSignup
        placement.raceid = raceid;
        placement.userid = newid;
        placement.paystatus = 'unpaid'
        const maybeEvent = await getEventFromFileName(file.name)
        if(!maybeEvent) return new NextResponse('CSV filename did not match an existing event for the race. Add a matching event on the race page.', {status: 415})
        placement.eventid = maybeEvent
        placement.bibnumber = newbib
        if(usertiming) placement.totaltime = usertiming
        newplacements.push(placement);
        resultusers.push(resultuser);
    }

    await db.transaction(async (tx) => {
        if(newplacements.length > 0){
            await tx.insert(signups).values(newplacements);
            await tx.insert(users).values(resultusers);}
        if(timings.length > 0){
            for(var timing of timings){
                await tx.update(signups).set({totaltime: timing.time})
                .where(eq(signups.id, timing.signupid))}}})
                
    return NextResponse.redirect(new URL(`/races/${raceid}`, request.url), 302);

    async function getEventFromFileName(filename: string){
        const eventlist = await db.select().from(events).where(eq(events.raceid, raceid))
        const lowfile = filename.toLowerCase()
        const targetevent = eventlist.filter(event => lowfile.includes(event.name.toLowerCase()))
        if(targetevent.length === 0) return null
        return targetevent[0].id
    }
}



function clockToSeconds(clocktime: string | null){
    if(!clocktime) return null
    let clocksplit = clocktime.split(":")
    let seconds = 0
    seconds += parseFloat(clocksplit.pop() ?? "0")
    seconds += parseFloat(clocksplit.pop() ?? "0")*60
    seconds += parseFloat(clocksplit.pop() ?? "0")*3600
    console.log(seconds)
    return seconds;
}