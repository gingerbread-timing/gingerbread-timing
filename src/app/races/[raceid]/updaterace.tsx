'use client'
import { Race } from "@/db/dbstuff";
import { useState } from "react";
import { RaceForm } from "../newrace/raceform";

export function UpdateRace({thisrace}: {thisrace: Race}){
    const [editMode, activateEdit] = useState(false)
    if(editMode){
        return(<RaceForm thisrace={thisrace}/>)
    }
    return(<div>
        <button onClick={() => activateEdit(true)}>Edit this Race</button>
    </div>)
}