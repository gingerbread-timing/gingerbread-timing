import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { db, Race } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { eq } from "drizzle-orm";
import { getInternalUser } from '@/servertools';
import { RaceDisplay } from '@/homecomponents/racedisplay';
import Link from 'next/link'

export default withPageAuthRequired(
  async function Profile() {
    const internalUser = await getInternalUser();
    //otherwise populate the page with the user's contact info

    //and the list of races theyre signed up for

    const racelist = await db.select().from(races)
      .innerJoin(signups, eq(races.id,signups.raceid))
      .where(eq(signups.userid,internalUser.id));
    const sortedraces = racelist.sort((r1, r2) => r1.races.starttime > r2.races.starttime ? 1 : -1)
    const today = new Date()
    const upcomingraces = sortedraces.filter(x => x.races.starttime > today)
    const pastraces = sortedraces.filter(x => x.races.starttime < today)

    const upmap = upcomingraces.map((item,index) => {return(<RaceDisplay myrace={item.races} key={index}/>);});
    const pastmap = pastraces.map((item,index) => {return(<RaceDisplay myrace={item.races} key={index}/>);});

    //stats to show: races run. total miles run. average pace. runs/year

    return (
      <div className='pagecontainer'>
        <h1>{internalUser.firstname} {internalUser.lastname}</h1>
        <div className='statrow'>STATS ABOUT PERSONAL RACE PERFORMANCE HERE</div>
        <h2>Upcoming Races</h2>
        {upmap}
        <h3>Completed Races</h3>
        {pastmap}
        <Link href="/adminhub"><h2>Admin Hub</h2></Link>
      </div>
      
    )
},
{ returnTo: '/' })