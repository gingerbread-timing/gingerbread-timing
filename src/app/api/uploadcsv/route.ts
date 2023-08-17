import { db, NewSignup, NewUser} from '@/db/dbstuff';
import { signups, users } from '@/db/schema';
import { NextResponse } from 'next/server';
import neatCsv from 'neat-csv';

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
    
    const userlist = await db.select().from(users);
    let newid = userlist.pop()?.id ?? 0;
    let resultusers = [] as NewUser[]
    let placements = [] as NewSignup[]
    //match headers to signup columns
    for(var entry of parsed){
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
        placement.bibnumber = parseInt(entry["Bib"])
        //placement.totaltime
        placements.push(placement);
        resultusers.push(resultuser);
    }

    await db.insert(signups).values(placements);
    await db.insert(users).values(resultusers);

    //identify csv entries against users

    //update signups where we have matches

    //insert everything else

    //redirect to the user list; change the string literal for other site locations 
    return NextResponse.redirect(new URL('/', request.url), 302);
}