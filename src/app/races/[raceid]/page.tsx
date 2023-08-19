//db imports
import { db, Race, Signup, User, UserSignup } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { getInternalUser, getStringDate, getStringTime, getUserAge } from '@/utils';
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
  const today = new Date();
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
        {(thisrace.starttime > today) && <PreRace data={signedup} thisrace={thisrace}/>}
        {(thisrace.endtime < today) && <PostRace signedup={signedup} thisrace={thisrace}/>}
        <CSVUploader thisrace={thisrace.id}/>
      </div>
    )
  }

  function PreRace(params: any){
    const thisrace = params.thisrace;
    const signedup = params.data;
    return(<div>
      <SignMeUp data={signedup} thisrace={thisrace}/>
      <div><Link href={`checkin/${thisrace.id}`}><h3>check-in this race</h3></Link></div>
    </div>)
  }

  function PostRace(params: {signedup: UserSignup[], thisrace: Race}){
    const thisrace = params.thisrace;
    const signedup = params.signedup;
    const sortedsigns = signedup.sort((s1: UserSignup, s2: UserSignup) => (s1.signups.totaltime ?? 0) > (s2.signups.totaltime ?? 0) ? 1 : -1)
    //sort signups by time and map them
    return(<div>
      <h2>RESULTS:</h2>
      <ResultsDisplay signs={sortedsigns}/>
    </div>)
  }

  function ResultsDisplay(params: {signs: UserSignup[]})
  {
    const userlist = params.signs.map((sign: UserSignup, index) => <ResultRunner runner={sign.users} runnersignup={sign.signups} place={index}/>);
    
    return(
      <div>
          {userlist}
      </div>
    );
  }

  function ResultRunner(params: any)
  {
    const runner: User = params.runner;
    const runnersignup: Signup = params.runnersignup;
    const age = getUserAge(runner);
    const clocktime = new Date((runnersignup.totaltime ?? 0) * 1000).toISOString().slice(11, 20);
    return(
        <div>
            Placement: {params.place+1} |
            Name: {runner.firstname} {runner.lastname} |
            Age: {age} |
            Time: {runnersignup.totaltime && <>{clocktime}</>}
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

  function CSVUploader(params: {thisrace: number}){
    return (
      <form action="/api/uploadcsv" method="post" encType="multipart/form-data">
            <div>
            <label htmlFor="csv"><h2>Upload Timing Data:</h2></label>
              <input type="file" id="csv" name="csv"/>
              <input type="hidden" id="raceid" name="raceid" value={params.thisrace}/>
            </div>
            <button type="submit">Upload CSV</button>
          </form>
    );
  }