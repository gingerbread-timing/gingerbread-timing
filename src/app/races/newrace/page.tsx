import '@/globals.css';
import { RaceForm } from './raceform';

export default function Page() {
    //fields need to be matched on api/route.ts in the NewRace object
    //date and/or time fields will break the 'insert' if they are null so keep them required
    return (<RaceForm thisrace={null}/>)
  }
