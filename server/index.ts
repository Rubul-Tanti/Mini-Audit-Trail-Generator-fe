import api from "../axios"
import {AuditRecord, getHistoryresponce} from "./type"

export const getHistory=async()=>{
    try{
            const res=await api.get('/user/get-history')
            return res.data?.data as getHistoryresponce
    }catch(e){
        console.log('something went wrong')
    }
}
export const saveText=async(editedText:string,orignalText:string)=>{
    try{ 
        const orgtext=orignalText||""
        const res=await api.post('/user/save-text',{editedText:editedText,orignalText:orgtext })

        return res.data?.data as AuditRecord
    }catch(e){
        console.log('something went wrong')
    }
}