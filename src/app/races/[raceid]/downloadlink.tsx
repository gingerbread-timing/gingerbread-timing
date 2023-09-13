'use client'
import { CSVLink } from "react-csv";
import { Race, UserSignup, Event } from "@/db/dbstuff";
import { getUserAge, getClockFromSeconds } from "@/clienttools";
import { useState } from "react";
export default function CSVDownloadLink({signedup, thisrace, events}: {signedup: UserSignup[], thisrace: Race, events: Event[]}){
    let eventoptions = events.map((event, index) => <option value={index}>{event.name}</option>)
    const [activeEvent, selectEvent] = useState(0)
    let csvData = [] as any
    if(signedup.length === 0 || events.length === 0) return (<>No data to download!</>)
    for(var signup of signedup){
        if(signup.signups.eventid != events[activeEvent].id) continue
        csvData.push({
            Bib: signup.signups.bibnumber,
            Name: `${signup.users.firstname} ${signup.users.lastname}`, 
            Gender: signup.users.gender.slice(0,1),
            Age: getUserAge(signup.users),
            City: signup.users.city,
            State: signup.users.state,
            Clocktime: getClockFromSeconds(signup.signups.totaltime)
            //division
        })
    }
    return (<>
    <>Event: </> 
    <select id="event" name="event" value={activeEvent} onChange={(e) => selectEvent(parseInt(e.target.value))}>
        {eventoptions}
    </select>
    <CSVLink data={csvData} enclosingCharacter={""} filename={`${thisrace.name} ${events[activeEvent].name} Race Report`}> Download Event Signups as CSV</CSVLink>
    </>)
}