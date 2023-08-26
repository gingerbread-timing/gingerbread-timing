'use client'
import { Race } from "@/db/dbstuff"
import { RaceDisplay } from './racedisplay';
import { useState } from "react";

export default function SearchableRaces(params: {races: Race[]})
{
    const [search, setSearch] = useState("")
    const onChange = (event: any) => {
        setSearch(event.target.value);
      };
    
    let searchedList = [] as Race[]
    for(var race of params.races){
        if(race.name.toLowerCase().includes(search)) searchedList.push(race)
    }
    const display = searchedList.map((item,index) => {return(<RaceDisplay myrace={item} key={index}/>);});
    return(
        <div>
            <div className='topInfoHolder'>
            <div className='findRace'>
            Find Race:
           </div>
            <div className='inputHolder'>
              <form noValidate action="" role="search" >
                <input value={search} onChange={onChange}
                  placeholder="Search races by name"
                  style={{ height:'20px',width:'280px',borderRadius:'10px', paddingLeft: '10px', marginTop: '5px',
                marginLeft: '8px'}}
                  title='Search bar'
                />
              </form>
            </div>
          </div>
            <HeaderBar/>
            {display}
        </div>
    )
}

function HeaderBar(){
    return(
    <>
        <div className='bigInfoHolder'>
          <div className='bottomInfoHolder'>
            <div className='raceNameHolder'>
              Race Name:
            </div>
            <div className='date'>
              Start Date & Time:
            </div>
            <div className='description'>
              Description:
            </div>
          </div>
        </div></>)
}

// const today = new Date()
//     const upcomingraces = params.races.filter(x => x.starttime > today)
//     const pastraces = params.races.filter(x => x.starttime < today)

//     const upmap = upcomingraces.map((item,index) => {return(<RaceDisplay myrace={item} key={index}/>);});
//     const pastmap = pastraces.map((item,index) => {return(<RaceDisplay myrace={item} key={index}/>);});