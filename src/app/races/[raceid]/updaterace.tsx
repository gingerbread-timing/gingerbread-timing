'use client'
import { Race } from "@/db/dbstuff";
import { useState } from "react";
import NewRace from "../newrace/page";

export function UpdateRace({thisrace}: {thisrace: Race}){
    const [editMode, activateEdit] = useState(false)
    if(editMode){
        return(<NewRace thisrace={thisrace}/>)
    }
    return(<div>
        <button onClick={() => activateEdit(true)}>Edit this Race</button>
    </div>)
}