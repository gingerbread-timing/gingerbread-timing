'use client'
import { checkIn } from "./checkinaction"
import { toast } from 'react-toastify';
export function CheckInForm(params: {raceid: number, signupid: number})
{
    async function clientCheckIn(formData: FormData){
        const res = await checkIn(formData)
        const bib = formData.get("bib") as string
        if(res.message == "duplicatebib") toast.error(`Bib number ${bib} is already in use.`)
        else if(res.message == "success") toast.success("Bib number assigned.")
    }
    return(
        <form action={clientCheckIn} style={{display: "inline"}}>
            <label htmlFor="bib"></label>
            <input type="number" id="bib" name="bib"/>
            <input type="hidden" value={params.raceid} id="raceid" name="raceid"/>
            <input type="hidden" value={params.signupid} id="signupid" name="signupid"/>
            <button type="submit">Check In</button>
        </form>
    )
}