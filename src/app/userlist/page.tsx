import { db, User, Admin } from '@/db/dbstuff';
import { users, admins } from '@/db/schema';
import './styles.css'

export default async function Home() {
  const usersresult: User[] = await db.select().from(users);
  const adminresult = await db.select().from(admins);
  const adminemails = adminresult.map((admin) => admin.email)
  const userlist = usersresult.map((user,index) => <UserDisplay user={user} admin={adminemails.includes(user.email)} key={index}/>);
    return (
      <div className='pagecontainer'>
        <h1>Users</h1>
        <div className='userrow'>
          <h3 className='listelement'>ID</h3>
          <h3 className='listelement'>Name</h3>
          <h3 className='listelement'>Email</h3>
          <h3 className='listelement'>Phone</h3>
          <h3 className='listelement'>Zip</h3>
        </div>
        {userlist}
      </div>
    )
  }

  function UserDisplay(params: {user: User, admin: boolean}){
    return(
      <div className='userrow'>
        <div className='listelement'>{params.user.id}</div>
        <div className='listelement'>{params.user.firstname} {params.user.lastname}</div>
        <div className='listelement'>{params.user.email}</div>
        <div className='listelement'>{params.user.phone}</div>
        <div className='listelement'>{params.user.zip}</div>
      </div>
    )
  }