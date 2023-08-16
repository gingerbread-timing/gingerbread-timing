//db imports
import { db, Race } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { getInternalUser, getStringDate, getStringTime } from '@/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { eq } from "drizzle-orm";
import Link from 'next/link';

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
    return (
      <div>
        <h1>{thisrace.name}</h1>
        <div>Description: {thisrace.description}</div>
        <div>Date: {getStringDate(thisrace.starttime)}</div>
        <div>Start Time: {getStringTime(thisrace.starttime)}</div>
        <div>End Time: {getStringTime(thisrace.endtime)}</div>
        <SignMeUp data={signedup} thisrace={thisrace}/>
        <SignOthersUp data={signedup} thisrace={thisrace}/>
        <div><Link href={`checkin/${params.raceid}`}>check-in this race (admin)</Link></div>
      </div>
    )
  }

  async function SignMeUp(params: any)
  {
    //if there's no login, prompt the user to login
    const session =  await getSession();
    if(!session) return (<h2>Log in to sign up for this race!</h2>);

    //if the logged in user is already signed up, let them know
    const userlist = params.data.map((user: any) => user.users.id);
    const internalUser = await getInternalUser();
    for(var user of userlist)
    {
      if(parseInt(user) === internalUser.id) return (<h2>looks like you're already signed up for this race!</h2>);
    }
   
    //otherwise allow a signup
    return(
      <div>
          <form action="/api/newsignup" method="post">
            <div>
              <input type="hidden" id="userid" name="userid" value={internalUser.id}/>
            </div>
              <input type="hidden" id="raceid" name="raceid" value={params.thisrace.id}/>
            <button type="submit">Sign me up for this race!</button>
          </form>
      </div>
    );
  }

  function SignOthersUp(params: any)
  {
    //id signup for testing
    return(
      <div>
          <form action="/api/newsignup" method="post">
            <div>
              <input type="text" id="userid" name="userid"/>
            </div>
              <input type="hidden" id="raceid" name="raceid" value={params.thisrace.id}/>
            <button type="submit">TEST FEATURE: sign user up by ID</button>
          </form>
      </div>
    );
  }