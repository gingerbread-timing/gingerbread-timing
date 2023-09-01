import { adminRestrict, getInternalUser } from '@/servertools'
import Link from 'next/link'

export default async function Home() {
  await adminRestrict()
    return (
      <div className='pagecontainer'>
        <h1>Admin Hub</h1>
        <div><Link href="/userlist">Master User List</Link></div>
        
        <div><Link href="/races/newrace">Create a race</Link></div>
      </div>
    )
  }

  