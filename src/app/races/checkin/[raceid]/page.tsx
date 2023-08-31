import { db, Race, User, Signup } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { eq } from "drizzle-orm";
import FindCheckIn from './findcheckin';


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
      <div className='pagecontainer'>
        <div className='racename'>{thisrace.name}</div>
        <h2>Check-In</h2>
        <FindCheckIn  signedup={signedup}/>
      </div>
    )
  }

  

  
