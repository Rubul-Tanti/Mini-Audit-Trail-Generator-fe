'use client'
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient, } from "@tanstack/react-query"
import {getHistory, saveText} from "../server/index"
import { useEffect, useState } from "react"
const queryClient=new QueryClient


const EditorPage=()=>{

    const {data,isLoading}=useQuery({queryKey:['textHistory'],queryFn:getHistory})
    const [text,setText]=useState('')
    const [orignalText,setOrignalText]=useState('')
    const queryClient=useQueryClient()
    useEffect(()=>{
      if(data){
        setText(data[data.length-1].text)
        setOrignalText(data[data.length-1].text)
      }
    },[data])
    const handleTextChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        e.preventDefault()
        setText(e.target.value)
    }
  const saveMutation = useMutation({
    mutationFn: () => saveText(text, orignalText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["textHistory"] });
    },
  });
    if(!isLoading)console.log(data)
    if(isLoading)return<>...</>
    
  return  <div className="  max-h-screen h-screen overflow-hidden p-10">
<header className=" border mb-10 border-zinc-100 shadow-sm shadow-gray-200 rounded-2xl p-10">
  <h1 className="text-4xl ">
  Mini Audit Trail Generator
  </h1>
</header>
<main className="grid-cols-3 w-full h-[78%] grid ">
  <div className="col-span-2">
    <textarea onChange={handleTextChange} value={text} placeholder="enter your text" className="w-full p-5  outline-0 border border-zinc-100 shadow min-h-54 rounded-2xl"/>
    <button onClick={()=>{saveMutation.mutate()}} className="bg-black py-2 cursor-pointer px-4 text-white rounded-xl mt-2">{saveMutation.isPending?"saving..":"save"}</button>
  </div>
  <div className="col-span-1 overflow-y-scroll  mx-5">
    <div className="flex justify-between items-center text-zinc-700 p-5 border border-zinc-100 shadow rounded-2xl">
    <h2>Version History </h2><h2>Total : {data?.length}</h2></div>
    <div className="flex flex-col-reverse"> 

    {data?.map((version,i)=>   <div key={version._id} className="w-full p-5 border mt-1   text-zinc-700 border-zinc-200 ">
      <div className="flex justify-between "><p>Version no {i+1}</p> <p className="text-xs">{new Date(version.timestamp).toLocaleString()}</p></div>
      <div className="flex justify-between text-sm mt-2"><p className="text-green-600">+ {version.addedWords.length} word added</p><p className="text-red-600">- {version.removedWords.length} word removed</p></div>
      <p className="p-1 bg-green-500 mb-2 text-white text-sm mt-2 w-fit rounded-full">Added</p>
      <div className="flex gap-1  items-center text-zinc-600">{version.addedWords.map((word,i)=><p key={i} className="text-xs  rounded-full border border-zinc-300  w-fit p-1">{word}</p>)} </div>
      <p className="p-1 bg-red-500 mb-2 text-white text-sm mt-2 w-fit rounded-full">Removed</p>
          <div className="flex gap-1  items-center text-zinc-600">{version.removedWords.map((word,i)=><p key={i} className="text-xs  rounded-full border border-zinc-300  w-fit p-1">{word}</p>)} </div>
    </div>)}
    </div>
 
    </div>
</main>


  </div>
}
const Home=()=>{
  return<QueryClientProvider client={queryClient}>
    <EditorPage/>
  </QueryClientProvider>
}
export default Home