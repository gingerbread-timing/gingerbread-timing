import '@/globals.css';
import { Race } from '@/db/dbstuff';
import { getIsoString } from '@/clienttools';

export default function NewRace({thisrace}:{thisrace?: Race | null}) {
    //fields need to be matched on api/route.ts in the NewRace object
    //date and/or time fields will break the 'insert' if they are null so keep them required
    console.log(getIsoString(thisrace?.endtime))
    return (
      <div>
        <h1>{thisrace ? `Update Race: ${thisrace.name}`:"Create a New Race"}</h1>
        <form action={thisrace ? "/api/updaterace" : "/api/newrace"} method="post" className='genericform'>
            <input type='hidden' id='raceid' name='raceid' value={thisrace?.id}/>
            <div>
                <label htmlFor="name">Race Name:</label>
                <input type="text" id="name" name="name" defaultValue={thisrace?.name} required minLength={2} maxLength={100}/>
            </div>
            <div>
                <label htmlFor="routeurl">Route URL:</label>
                <input type="text" id="routeurl" name="routeurl" defaultValue={thisrace?.routeURL ?? ""} required minLength={5} maxLength={100}/>
            </div>
            <div>
                <label htmlFor="herourl">Upload Image Placeholder:</label>
                <input type="text" id="herourl" name="herourl" defaultValue={thisrace?.heroURL ?? ""} maxLength={100}/>
            </div>
            <div>
                <label htmlFor="starttime">Start Time:</label>
                <input type="datetime-local" id="starttime" name="starttime" defaultValue={getIsoString(thisrace?.starttime).slice(0,-9)} required/>
            </div>
            <div>
                <label htmlFor="endtime">End Time:</label>
                <input type="datetime-local" id="endtime" name="endtime" defaultValue={getIsoString(thisrace?.endtime).slice(0,-9)} required/>
            </div>
            <div>
                <label htmlFor="length">Length:</label>
                <input type="text" id="length" name="length" defaultValue={thisrace?.length ?? ""} required/>
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <input type="text" id="description" name="description" defaultValue={thisrace?.description ?? ""} required/>
            </div>
            <div>
                <label htmlFor="contactemail">Contact Email:</label>
                <input type="text" id="contactemail" name="contactemail" required defaultValue={thisrace?.contactemail ?? ""}/>
            </div>
            <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
