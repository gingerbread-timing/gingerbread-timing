import { db, Race, User, Signup } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { getUserAge } from '@/clienttools';
import { eq } from "drizzle-orm";
import { CheckInForm } from './checkinform';

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
    return(
      <div>
        {params.signup.bibnumber && <>| Bib#: {params.signup.bibnumber}</>}
        <CheckInForm raceid={params.signup.raceid} signupid={params.signup.id}/>
      </div>
    );
  }

  
