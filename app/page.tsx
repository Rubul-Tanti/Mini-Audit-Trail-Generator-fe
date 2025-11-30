'use client'
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient, } from "@tanstack/react-query"
import {getHistory, saveText} from "../server/index"
import { useEffect, useRef, useState } from "react"
const queryClient=new QueryClient


const EditorPage=()=>{

    const {data,isLoading}=useQuery({queryKey:['textHistory'],queryFn:getHistory})
    const [text,setText]=useState('')
    const [orignalText,setOrignalText]=useState('')
    const queryClient=useQueryClient()
    const historyRef = useRef<HTMLDivElement>(null);

// Scroll to bottom when history updates
useEffect(() => {
  if (historyRef.current) {
    historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }
}, [data]);
    useEffect(()=>{
      if(data){
        setText(data[data.length-1]?.text)
        setOrignalText(data[data.length-1]?.text)
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
    if(isLoading)return<div className="text-4xl flex justify-center items-center h-screen animate-pulse">...</div>
    
  return  <div className="   md:h-screen overflow-hidden p-10">
<header className=" border mb-10 border-zinc-100 shadow-sm shadow-gray-200 rounded-2xl p-10">
  <h1 className="text-4xl ">
  Mini Audit Trail Generator
  </h1>
</header>
<main className="grid grid-cols-1 md:grid-cols-3 w-full h-auto md:h-[78%] gap-5">
  {/* input side*/}
  <div className="md:col-span-2 flex flex-col">
    <textarea
      onChange={handleTextChange}
      value={text}
      placeholder="enter your text"
      className="w-full p-5 outline-0 border border-zinc-100 shadow max-h-64  rounded-2xl h-[250px] md:h-full"
    />
    <button
      onClick={() => saveMutation.mutate()}
      className="bg-black py-2 cursor-pointer px-4 text-white rounded-xl mt-3 w-full md:w-fit"
    >
      {saveMutation.isPending ? "saving.." : "save"}
    </button>
  </div>

  {/* history side */}
  <div className="md:col-span-1  mx-1 md:mx-5  md:max-h-full">
    <div className="flex flex-col md:flex-row md:justify-between gap-2 items-start md:items-center text-zinc-700 p-5 border border-zinc-100 shadow rounded-2xl">
      <h2 className="font-medium">Version History</h2>
      <h2 className="text-sm">Total : {data?.length}</h2>
    </div>

    <div ref={historyRef} className="flex flex-col-reverse max-h-[350px] overflow-y-auto">
      {data?.map((version, i) => (
        <div
          key={version._id}
          className="w-full p-5 border mt-2 text-zinc-700 border-zinc-200 rounded-xl"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="text-sm">Version no {i + 1}</p>
            <p className="text-xs mt-1 md:mt-0">
              {new Date(version.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between text-sm mt-2">
            <p className="text-green-600">+ {version.addedWords.length} added</p>
            <p className="text-red-600">- {version.removedWords.length} removed</p>
          </div>

          <p className="p-1 bg-green-500 mb-2 text-white text-sm mt-2 w-fit rounded-full">
            Added
          </p>
          <div className="flex flex-wrap gap-1 items-center text-zinc-600">
            {version.addedWords.map((word, i) => (
              <p
                key={i}
                className="text-xs rounded-full border border-zinc-300 p-1"
              >
                {word}
              </p>
            ))}
          </div>

          <p className="p-1 bg-red-500 mb-2 text-white text-sm mt-2 w-fit rounded-full">
            Removed
          </p>
          <div className="flex flex-wrap gap-1 items-center text-zinc-600">
            {version.removedWords.map((word, i) => (
              <p
                key={i}
                className="text-xs rounded-full border border-zinc-300 p-1"
              >
                {word}
              </p>
            ))}
          </div>
        </div>
      ))}
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