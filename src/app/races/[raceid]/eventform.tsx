'use client'
import { SubmitNewEvent } from "./eventaction"
import './styles.css'
export function AddEvent({raceid} : {raceid: number}){
    return(
        <div className="shadowbox">
            <h3>Add an Event</h3>
            <form action={SubmitAndClear} id="eventForm">
                <div>
                <input type="hidden" value={raceid} id="raceid" name="raceid"/>
                <label htmlFor="name">Event Name </label>
                <input type="text" id="name" name="name"/>
                </div>
                <label htmlFor="price">{'Price (USD) '}</label>
                <input type="number" id="price" name="price"/>
                <div><button type="submit">Create Event</button></div>
            </form>
        </div>
    )
}

async function SubmitAndClear(formData: FormData){
    await SubmitNewEvent(formData)
    const form = document.getElementById("eventForm") as HTMLFormElement
    form.reset()
}