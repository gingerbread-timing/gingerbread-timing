import { Race } from '../db/dbstuff';
import Link from 'next/link';
import { getStringDate, getStringTime } from '../clienttools';
export function RaceDisplay(props: any){
    //see schema.ts for which fields you have access to through the Race object
    const race: Race = props.myrace;
    const start = race.starttime;
    const fullDate = getStringDate(start);
    const fullTime = getStringTime(start);
    
  
    //return our data from the db plus a dynamic route link based on the race ID
    return (
      <li className='listedrace'>
        <div className='listelement'> <Link href={`/races/${race.id}`}>{race.name}</Link></div>
        
        <div className='listelement'> {fullDate} {fullTime}</div>
        {/* <div> {fullTime}</div> */}
        <div className='listelement'> {race.description}</div>
        {/* how are we going to handle overflow? wrap???  */}
      </li>
    )
  }