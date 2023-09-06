'use client'
import { UserSignup, User, Signup, Event } from "@/db/dbstuff";
import { getUserAge, getClockFromSeconds } from '@/clienttools';
import { useState } from "react";
import './styles.css'

export function ResultsDisplay({signs, events}: {signs: UserSignup[], events: Event[]})
  {
    const [userlist, setuserlist] = useState(signs)

    const [activeEvent, selectEvent] = useState(0)
    let eventoptions = events.map((event, index) => <option value={index}>{event.name}</option>)
    const eventsigns = userlist.filter(sign => sign.signups.eventid === events[activeEvent].id)
    const display = eventsigns.map((sign: UserSignup, index)=> 
        <ResultRunner runner={sign.users} runnersignup={sign.signups} place={index} key={index}/>)

    return(
      <div>
        <h3> <>Event:  </>
          <select id="event" name="event" value={activeEvent} onChange={(e) => selectEvent(parseInt(e.target.value))}>
            {eventoptions}
          </select>
        </h3>
            
        <form action={filterResults}>
          <label htmlFor="name"> Name: </label>
            <input type="text" id="name" name="name"/>
            
            <label htmlFor="gender"> Gender: </label>
            <select id="gender" name="gender">
                <option value="all">All</option>
                <option value="male">M</option>
                <option value="female">F</option>
                <option value="nonbinary">NB</option>
            </select>
            <label htmlFor="agemin"> Age Range: </label>
            <input type="number" id="agemin" name="agemin" size={3}/>-
            <input type="number" id="agemax" name="agemax" size={3} maxLength={3}/>
            <button type="submit">Filter Results</button>
        </form>
        <div className="runnerresult"style={{backgroundColor: "teal"}}>
            <h3 className="listelement">Placement</h3>
            <h3 className="listelement">Name</h3>
            <h3 className="listelement">Age</h3>
            <h3 className="listelement">Time</h3>
        </div>
          {display}
      </div>
    );
    async function filterResults(formData: FormData){
        const gen = String(formData.get("gender")).toLowerCase()
        let output = [] as UserSignup[]

        const lowname = String(formData.get("name")).toLowerCase()
        const eventid = events[activeEvent].id
        for(let i = 0; i < signs.length; i++){
            const sign = signs[i]
            if(sign.signups.eventid != eventid) continue
            const fullname = `${sign.users.firstname} ${sign.users.lastname}`.toLowerCase()
            if(!fullname.includes(lowname ?? "")) continue
            if(gen != "all" && gen.charAt(0) != sign.users.gender.toLowerCase().charAt(0)) continue
            const age = getUserAge(sign.users)
            if(age < (parseInt(String(formData.get("agemin"))) ?? 0)
            || (age > (parseInt(String(formData.get("agemax"))) ?? 120))) continue
            output.push(sign)
        }
        setuserlist(output)
    }
  }
  function ResultRunner({runner, runnersignup, place}: {runner: User, runnersignup: Signup, place: number})
  {
    const age = getUserAge(runner);
    const clocktime = getClockFromSeconds(runnersignup.totaltime);
    return(
        <div className="runnerresult">
            <div className="listelement">{place+1}</div>
            <div className="listelement">{runner.firstname} {runner.lastname}</div>
            <div className="listelement">{age}</div>
            <div className="listelement">{runnersignup.totaltime && <>{clocktime}</>}</div>
        </div>
    )
  }