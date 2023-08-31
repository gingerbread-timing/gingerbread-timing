'use client'
import { UserSignup, User, Signup } from "@/db/dbstuff";
import { getUserAge, getClockFromSeconds } from '@/clienttools';

export function ResultsDisplay(params: {signs: UserSignup[]})
  {
    const userlist = params.signs.map((sign: UserSignup, index) => <ResultRunner runner={sign.users} runnersignup={sign.signups} place={index} key={index}/>);
    
    return(
      <div>
          {userlist}
      </div>
    );
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