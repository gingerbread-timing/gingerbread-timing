//db imports
import { db, Race, UserSignup } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { getInternalUser, userIsAdmin } from '@/servertools';
import { getStringDate, getStringTime, getUserAge, getClockFromSeconds } from '@/clienttools';
import { getSession } from '@auth0/nextjs-auth0';
import { eq } from "drizzle-orm";
import { ResultsDisplay } from './findresult';
import Link from 'next/link';
import CSVDownloadLink from './downloadlink';
import './styles.css'

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
  const admin = await userIsAdmin(await getInternalUser())
  const signedup = await db.select().from(users)
    .innerJoin(signups, eq(users.id,signups.userid))
    .where(eq(signups.raceid,thisrace.id));
    return (
      <div className='pagecontainer'>
        <div className='backgroundimage'>
          <div className='racename'>{thisrace.name}</div>
          <hr/>
          <div className='racecore'>{getStringDate(thisrace.starttime)}</div>
          <div className='racecore'>LOCATION HERE</div>
          <div className='racecore'>{getStringTime(thisrace.starttime)} - {getStringTime(thisrace.endtime)}</div>
        </div>
        <h1>Description</h1>
        <div>{thisrace.description}</div>
        {(thisrace.starttime > today) && <PreRace signups={signedup} thisrace={thisrace}/>}
        {(thisrace.endtime < today) && <PostRace signedup={signedup} thisrace={thisrace}/>}
        {admin && <CSVUploader thisrace={thisrace.id}/>}
        {admin && <CSVDownloader signedup={signedup} thisrace={thisrace}/>}
      </div>
    )
  }

  async function PreRace({signups, thisrace}: {signups: UserSignup[], thisrace: Race}){
    //if there's no login, prompt the user to login
    const session =  await getSession();
    if(!session) return (<h2><a href="/api/auth/login">Log in</a> to sign up for this race!</h2>);
    const internalUser = await getInternalUser();
    //if the logged in user is already signed up, let them know
    const mysignup = signups.filter((sign) => sign.users.id == internalUser.id).pop()
    if(mysignup){
      switch(mysignup.signups.paystatus){
        case 'paid':
          return (<h2>Looks like you're already signed up for this race!</h2>);
        case 'pending':
          return (<h2>Payment is being processed...</h2>);
      }
    }
    return(
    <div>
      <form action="/api/newsignup" method="post">
        <div>
          <input type="hidden" id="userid" name="userid" value={internalUser.id}/>
        </div>
          <input type="hidden" id="raceid" name="raceid" value={thisrace.id}/>
        <button type="submit">Sign me up for this race!</button>
      </form>
      <div><Link href={`checkin/${thisrace.id}`}><h3>check-in this race</h3></Link></div>
    </div>)
  }

  function PostRace(params: {signedup: UserSignup[], thisrace: Race}){
    const thisrace = params.thisrace;
    const signedup = params.signedup;
    const sortedsigns = signedup.sort((s1: UserSignup, s2: UserSignup) => (s1.signups.totaltime ?? 0) > (s2.signups.totaltime ?? 0) ? 1 : -1)
    //sort signups by time and map them
    return(<div>
      <h2>RESULTS</h2>
      <ResultsDisplay signs={sortedsigns}/>
    </div>)
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

  function CSVDownloader(params: {signedup: UserSignup[], thisrace: Race}){
    let csvData = [] as any
    if(params.signedup.length === 0) return (<>No data to download!</>)
    for(var signup of params.signedup){
      csvData.push({
        Bib: signup.signups.bibnumber,
        Name: `${signup.users.firstname} ${signup.users.lastname}`, 
        Gender: signup.users.gender.slice(0,1),
        Age: getUserAge(signup.users),
        City: signup.users.city,
        State: signup.users.state,
        Clocktime: getClockFromSeconds(signup.signups.totaltime)
        //division
      })
    }
    return(<CSVDownloadLink csvData={csvData} thisrace={params.thisrace}/>)
  }