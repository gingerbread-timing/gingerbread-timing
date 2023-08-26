import { db, Race, User, Signup } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { getInternalUser, getUserAge } from '@/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { revalidatePath } from 'next/cache';
import { eq } from "drizzle-orm";

//pull in race ID through URL
export default async function Page({ params }: { params: { raceid: number } }) {
  //search the database for a matching ID
  const result: Race[] = await db.select().from(races).where(eq(races.id,params.raceid));

  //if we didn't find anything, return an error message
  if(result.length === 0)
  { return(<div>RACE ID NOT FOUND</div>) }

  //otherwise, grab the result and return a page populated with that row of races
  const thisrace: Race = result[0];
  const signedup = await db.select().from(users)
    .innerJoin(signups, eq(users.id,signups.userid))
    .where(eq(signups.raceid,thisrace.id));
    const signedusers: User[] = signedup.map(instance => instance.users);
    const signupinfo: Signup[] = signedup.map(instance => instance.signups);
    return (
      <div>
        <h1>{thisrace.name}</h1>
        <h2>Check in users</h2>
        <AssignedUsers  userinfo={signedusers} signupinfo={signupinfo}/>
      </div>
    )
  }

  function AssignedUsers(params: any)
  {
    const userlist = params.userinfo.map((user: User, index: number) => <SignedRunner runner={user} runnersignup={params.signupinfo[index]}/>);
    
    return(
      <div>
          {userlist}
      </div>
    );
  }

  function SignedRunner(params: any)
  {
    const runner: User = params.runner;
    const runnersignup: Signup = params.runnersignup;
    const age = getUserAge(runner);
    return(
        <div>
            First: {runner.firstname} |
            Last: {runner.lastname} |
            Age: {age}
            <CheckInStatus signup={runnersignup}/>
        </div>
    )
  }

  function CheckInStatus(params: {signup: Signup}){
    async function checkIn(form: FormData) {
        'use server'
        const racesignups: Signup[] = await db.select().from(signups).where(eq(signups.raceid,params.signup.raceid));
        let bibs = racesignups.map(x => x.bibnumber);
        bibs.sort();
        const formobj = Object.fromEntries(form);
        var newbib = 0
        if(formobj.bib)
        {
          newbib = parseInt(formobj.bib as string) ?? 0;
          if(bibs.includes(newbib))
          {
            //alertService.error("That bib number is already in use!", {autoClose: true})
            return false
          }
        }
        if(newbib == 0){
          newbib = (bibs[bibs.length-1] ?? 0) + 1;
        }
        await db.update(signups)
        .set({ bibnumber: newbib })
        .where(eq(signups.id, params.signup.id));
        revalidatePath(`/races/checkin/${params.signup.raceid}`)
      }
    const conflict = 0 //= includesMultiple(bibs, params.signup.bibnumber)
    return(
      <div>
        {params.signup.bibnumber && <>| Bib#: {params.signup.bibnumber}</>}
        {conflict && <>| BIB CONFLICT</>}
        <form action={checkIn}>
            <label htmlFor="bib">Assign Bib:</label>
            <input type="number" id="bib" name="bib"/>
            <button type="submit">Check In</button>
        </form>
      </div>
    );
  }

  
