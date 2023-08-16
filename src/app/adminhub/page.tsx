import Link from 'next/link'

export default function Home() {
    return (
      <div>
        <h1>Admin Hub</h1>
        <div><Link href="/userlist">Master User List</Link></div>
        
        <div><Link href="/races/newrace">Create a race</Link></div>
        <CSVUploader/>
      </div>
    )
  }

  function CSVUploader(){
    return (
      <form action="/api/newsignup" method="post">
            <div>
              <input type="file" id="csv" name="csv"/>
            </div>
            <button type="submit">Upload CSV</button>
          </form>
    );
  }