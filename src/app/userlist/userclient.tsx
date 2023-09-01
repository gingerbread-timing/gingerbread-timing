'use client'

import { useTransition, useState, ChangeEvent } from "react"
import { ModifyAdmin, DeleteUser } from "./useractions"
import { User } from "@/db/dbstuff";

export function FindUser({usersresult, adminemails, loggeduser}: {usersresult: User[], adminemails: string[], loggeduser: User}){
    const [search, setSearch] = useState("")
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
      };
    
    let display = [] as JSX.Element[]
    const lowsearch = search.toLowerCase()
    let index = 0
    for(let i = 0; i < usersresult.length; i++){
        const user = usersresult[i]
        const fullname = `${user.firstname} ${user.lastname}`.toLowerCase()
        if(fullname.includes(lowsearch) || user.email.toLowerCase().includes(lowsearch)){
            index++
            display.push(<UserDisplay user={user} 
                admin={user.email.includes('@') && adminemails.includes(user.email)} 
                enabled={loggeduser.email == user.email} key={index}/>)
        }
    }
    return (
      <div>
        <form noValidate action="" role="search" >
            <input value={search} onChange={onChange}
                placeholder="Search users by full name or email"
                style={{ height:'20px',width:'280px',borderRadius:'10px', paddingLeft: '10px', marginTop: '5px',
            marginLeft: '8px'}}
                title='Search bar'
            />
        </form>
        <div className='userrow'>
          <h3 className='listelement'>ID</h3>
          <h3 className='listelement'>Name</h3>
          <h3 className='listelement'>Email</h3>
          <h3 className='listelement'>Phone</h3>
          <h3 className='listelement'>Zip</h3>
          <h3 className='listelement'>Admin</h3>
          <h3 className='listelement'>Delete</h3>
        </div>
        {display}
      </div>
    )
}

function UserDisplay({user, admin, enabled}: {user: User, admin: boolean, enabled: boolean}){
    const [isPending, startTransition] = useTransition()
    //enabled is always returning false; why?
    return(
      <div className='userrow'>
        <div className='listelement'>{user.id}</div>
        <div className='listelement'>{user.firstname} {user.lastname}</div>
        <div className='listelement'>{user.email}</div>
        <div className='listelement'>{user.phone}</div>
        <div className='listelement'>{user.zip}</div>
        <div className='listelement'><input type='checkbox' name='admin' checked={admin} disabled={enabled} onChange={() => startTransition(() => ModifyAdmin(user.email))}/></div>
        <div className='listelement'><button onClick={() => startTransition(() => DeleteUser(user.id))}>DELETE</button></div>
      </div>
    )
  }