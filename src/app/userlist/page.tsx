import { db } from '@/db/dbstuff';
import { users, admins } from '@/db/schema';
import './styles.css'
import { getInternalUser, adminRestrict } from '@/servertools';
import { FindUser } from './userclient';

export default async function Home() {
  await adminRestrict()
  const loggeduser = await getInternalUser()
  const usersresult = await db.select().from(users);
  const adminresult = await db.select().from(admins);
  const adminemails = adminresult.map((admin) => admin.email)
    return (
      <div className='pagecontainer'>
        <h1>Users</h1>
        <FindUser adminemails={adminemails} usersresult={usersresult} loggeduser={loggeduser}/>
      </div>
    )
  }

  