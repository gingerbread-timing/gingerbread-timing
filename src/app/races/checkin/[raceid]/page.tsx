import { db, Race, User } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { getInternalUser, getUserAge } from '@/utils';
import { getSession } from '@auth0/nextjs-auth0';
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
    return (
      <div>
        <h1>{thisrace.name}</h1>
        <h1>Check in users</h1>
        <AssignedUsers  data={signedusers}/>
      </div>
    )
  }

  function AssignedUsers(params: any)
  {
    const userlist = params.data.map((user: User) => <SignedRunner runner={user}/>);
    
    return(
      <div>
          {userlist}
      </div>
    );
  }

  function SignedRunner(params: any)
  {
    const runner: User = params.runner;
    const age = getUserAge(runner);
    return(
        <div>
            <div>{runner.firstname}</div>
            <div>{runner.lastname}</div>
            <div>{age}</div>
        </div>
    )
  }
