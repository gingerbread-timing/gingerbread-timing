//db imports
import { db, Race } from './db/dbstuff';
import { races } from './db/schema';
import Image  from 'next/image';
import people from '@/images/peoplerunning.jpg'

import SearchableRaces from './homecomponents/findrace';
//link import


import './homestyles.css'

const result: Race[] = await db.select().from(races);
const sortedraces = result.sort((r1, r2) => r1.starttime > r2.starttime ? 1 : -1)


export default function Home() {
  //build a list of races based on the race table, then pass the race object as a parameter to the component
  return (
    <div>
      
      <SearchableRaces races={sortedraces}/>
    </div>
  )
}

//<Image src={people} alt='people running' className='people'/> 


