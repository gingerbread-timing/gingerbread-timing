//db imports
import { db, Race, UserSignup, Event } from '@/db/dbstuff';
import { races, users, signups, events } from '@/db/schema';
import { getInternalUser, userIsAdmin } from '@/servertools';
import { getStringDate, getStringTime } from '@/clienttools';
import { getSession } from '@auth0/nextjs-auth0';
import { eq } from "drizzle-orm";
import { ResultsDisplay } from './findresult';
import { AddEvent } from './eventform';
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
  const eventlist = await db.select().from(events).where(eq(events.raceid, thisrace.id))
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
        {(thisrace.starttime > today) && <PreRace signups={signedup} thisrace={thisrace} eventlist={eventlist}/>}
        {<PostRace signedup={signedup} eventlist={eventlist}/>}
        {admin && (<div className='adminzone'>
          <h2>Admin Zone</h2>
          {(thisrace.starttime > today) && <AddEvent raceid={thisrace.id}/>}
          <CSVUploader thisrace={thisrace.id}/>
          <CSVDownloadLink signedup={signedup} thisrace={thisrace} events={eventlist}/>
        </div>)}
      </div>
    )
  }

  async function PreRace({signups, thisrace, eventlist}: {signups: UserSignup[], thisrace: Race, eventlist: Event[]}){
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
    const display = eventlist.map((event) => <div className='shadowbox'>
      <h3>{event.name}</h3>
      <h3>{event.price}$</h3>
      <form action="/api/newsignup" method="post">
        <div>
          <input type="hidden" id="userid" name="userid" value={internalUser.id}/>
        </div>
          <input type="hidden" id="raceid" name="raceid" value={thisrace.id}/>
          <input type="hidden" id="eventid" name="eventid" value={event.id}/>
        <button type="submit">Sign Me Up!</button>
      </form>
    </div>)

    return(
    <div>
      <div className='eventcontainer'>
      <h2>Events:</h2>
      {display}
      </div>
      <div>
        <Link href={`checkin/${thisrace.id}`}><h3>Day-Of Check-In</h3></Link>
      </div>
    </div>)
  }

  function PostRace({signedup, eventlist}: {signedup: UserSignup[], eventlist: Event[]}){
    const sortedsigns = signedup.sort((s1: UserSignup, s2: UserSignup) => (s1.signups.totaltime ?? 0) > (s2.signups.totaltime ?? 0) ? 1 : -1)
    //sort signups by time and map them
    return(<div>
      <h2>RESULTS</h2>
      <ResultsDisplay signs={sortedsigns} events={eventlist}/>
    </div>)
  }

  function CSVUploader(params: {thisrace: number}){
    return (
      <form action="/api/uploadcsv" method="post" encType="multipart/form-data">
            <div>
            <label htmlFor="csv"><h4>Upload Timing Data:</h4></label>
              <input type="file" id="csv" name="csv"/>
              <input type="hidden" id="raceid" name="raceid" value={params.thisrace}/>
              <button type="submit">Upload CSV</button>
            </div>
          </form>
    );
  }