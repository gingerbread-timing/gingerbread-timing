'use client'
import { User, Signup, UserSignup } from '@/db/dbstuff';
import { CheckInForm } from './checkinform';
import { getUserAge } from '@/clienttools';
import { ChangeEvent, useState } from 'react';
import './styles.css'

export default function FindCheckIn(params: {signedup: UserSignup[]})
  {
    if(params.signedup.length == 0) return (<>Nobody is currently signed up for this race.</>)
    const [search, setSearch] = useState("")
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
      };
    
    let display = [] as JSX.Element[]
    const lowsearch = search.toLowerCase()
    let index = 0
    for(var entry of params.signedup){
        const fullname = `${entry.users.firstname} ${entry.users.lastname}`.toLowerCase()
        if(fullname.includes(lowsearch)){
            index++
            display.push(<SignedRunner runner={entry.users} runnersignup={entry.signups} key={index}/>)
        }
    }

    return(
      <div>
        <form noValidate action="" role="search" >
            <input value={search} onChange={onChange}
                placeholder="Search users by full name"
                style={{ height:'20px',width:'280px',borderRadius:'10px', paddingLeft: '10px', marginTop: '5px',
            marginLeft: '8px'}}
                title='Search bar'
            />
        </form>
            <div className='checkin'>
                <h3 className='listelement'>Name</h3>
                <h3 className='listelement'>Age</h3>
                <h3 className='listelement'>Bib #</h3>
                <h3 className='listelement'>Assign Bib</h3>
            </div>
          {display}
      </div>
    );
  }

  function SignedRunner(params: any)
  {
    const runner: User = params.runner;
    const runnersignup: Signup = params.runnersignup;
    const age = getUserAge(runner);
    return(
        <div className='checkin'>
            <div className='listelement'>{runner.firstname} {runner.lastname}</div>
            <div className='listelement'>{age}</div>
            {(runnersignup.bibnumber && <div className='listelement'>{runnersignup.bibnumber}</div>) 
            || <div className='listelement'>Unassigned</div>}
            <div className='listelement'><CheckInForm raceid={runnersignup.raceid} signupid={runnersignup.id} /></div>    
        </div>
    )
  }