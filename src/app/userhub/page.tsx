import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { db, Race } from '@/db/dbstuff';
import { races, users, signups } from '@/db/schema';
import { eq } from "drizzle-orm";
import { requireInternalUser, userIsAdmin } from '@/servertools';
import { RaceDisplay } from '@/homecomponents/racedisplay';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

export default withPageAuthRequired(
  async function Profile() {
    const internalUser = await requireInternalUser();
    const admin = await userIsAdmin(internalUser)

    const racelist = await db.select().from(races)
      .innerJoin(signups, eq(races.id,signups.raceid))
      .where(eq(signups.userid,internalUser.id));
    const sortedraces = racelist.sort((r1, r2) => r1.races.starttime > r2.races.starttime ? 1 : -1)
    const today = new Date()
    const upcomingraces = sortedraces.filter(x => x.races.starttime > today)
    const pastraces = sortedraces.filter(x => x.races.starttime < today)

    const upmap = upcomingraces.map((item,index) => {return(<RaceDisplay myrace={item.races} key={index}/>);});
    const pastmap = pastraces.map((item,index) => {return(<RaceDisplay myrace={item.races} key={index}/>);});

    //stats to show: races run. total miles run. Avg pace. runs/year

    return (
      <div className="container-md">
        <div className="row" style={{paddingTop: '1em'}}>
          <div className="col">
            <h1>{internalUser.firstname} {internalUser.lastname}</h1>
          </div>
          <div className="col"></div>
          <div className="col">
            <div>
             {admin && <Link href="/adminhub"><h2>Admin Hub</h2></Link>}
            </div>
          </div>
        </div>
        <div className="text-center" style={{paddingTop: '2em', fontWeight: 'bolder'}}>Races</div>
        <div className="row">
          <div className="col">
            <div>Total Ran: </div>
          </div>
          <div className="col">
            <div>Ran This Year: </div>
          </div>
          <div className="col">
            <div>Avg/Year: </div>
          </div>
        </div>
        <div className="text-center" style={{paddingTop: '2em', fontWeight: 'bolder'}}>Miles</div>
        <div className="row">
          <div className="col">
            <div>Total Ran: </div>
          </div>
          <div className="col">
            <div>Ran This Year: </div>
          </div>
          <div className="col">
            <div>Avg/Year: </div>
          </div>
        </div>
        <div className="text-center" style={{paddingTop: '2em', fontWeight: 'bolder'}}>Speed</div>
        <div className="row" style={{paddingBottom: '2em'}}>
          <div className="col">
            <div>Avg Mile(Total): </div>
          </div>
          <div className="col">
            <div>Avg Mile(Last Race): </div>
          </div>
          <div className="col">
            <div>Avg Mile(This Year): </div>
          </div>
        </div>

        <h2>Upcoming Races</h2>
        {upmap}
        <h3>Completed Races</h3>
        {pastmap}
        <a href="/api/auth/logout">Log Out</a>
      </div>
      
    )
},
{ returnTo: '/' })