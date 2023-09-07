import Link from "next/link"
export default async function Page({searchParams}: {
    searchParams: {raceid: string}}){
        const raceid = parseInt(searchParams.raceid)
        return(
            <div className="pagecontainer">
                You've succesfully created a race! You'll need to add events to the race to allow users to sign up.
                <Link href={`/races/${raceid}`}> Click here to go to the new race's page</Link>
                , or <Link href='/adminhub'> click here to return to the admin hub.</Link>
            </div>
        )
    }