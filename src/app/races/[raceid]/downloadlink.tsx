'use client'
import { CSVLink } from "react-csv";
export default function CSVDownloadLink(params: any){
    return (<CSVLink data={params.csvData} filename={`${params.thisrace.name} Runner Report`}>Download CSV</CSVLink>)
}