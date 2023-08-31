'use client'
import { UserSignup, User, Signup } from "@/db/dbstuff";
import { getUserAge, getClockFromSeconds } from '@/clienttools';
import { useState } from "react";

export function ResultsDisplay(params: {signs: UserSignup[]})
  {
    const [userlist, setuserlist] = useState(
        params.signs.map((sign: UserSignup, index)=> 
        <ResultRunner runner={sign.users} runnersignup={sign.signups} place={index} key={index}/>))
    
    return(
      <div>
        <form action={filterResults}>
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
          {userlist}
      </div>
    );
    async function filterResults(formData: FormData){
        const gen = String(formData.get("gender")).toLowerCase()
        let display = [] as JSX.Element[]
        for(let i = 0; i < params.signs.length; i++){
            const sign = params.signs[i]
            if(gen != "all" && gen.charAt(0) != sign.users.gender.toLowerCase().charAt(0)) continue
            const age = getUserAge(sign.users)
            if(age < (parseInt(String(formData.get("agemin"))) ?? 0)
            || (age > (parseInt(String(formData.get("agemax"))) ?? 120))) continue
            display.push(<ResultRunner runner={sign.users} runnersignup={sign.signups} place={i} key={i}/>)
        }
        setuserlist(display)
    }
  }

  

  function ResultRunner(params: any)
  {
    const runner: User = params.runner;
    const runnersignup: Signup = params.runnersignup;
    const age = getUserAge(runner);
    const clocktime = getClockFromSeconds(runnersignup.totaltime);
    return(
        <div>
            Placement: {params.place+1} |
            Name: {runner.firstname} {runner.lastname} |
            Age: {age} |
            Time: {runnersignup.totaltime && <>{clocktime}</>}
        </div>
    )
  }