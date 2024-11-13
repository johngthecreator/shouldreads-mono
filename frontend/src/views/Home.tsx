import {pipeline } from '@huggingface/transformers';
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

export interface IBookResponse {
    author: string,
    desc: string,
    genres: string[],
    isbn: number,
    link: string,
    title: string,
}


const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

const vectorize = async (query: string) => {
    // const sentences = ['What should I buy from the grocery?', 'you can convert sentences', "let's test this", "Remind me later today that I need to grab milk", "Here are the groceries I'm getting: milk, eggs, fruit, water"];
    const output = await extractor(query, { pooling: 'mean', normalize: true });
    return output.tolist()
}

const pageTitles = [
"romance",
"mystery",
"thriller",
"journey"
]

const indexed = Math.floor(Math.random() * 4)

export default function Home () {
    const [query, setQuery] = useState<string>("");
    const [books, setBooks] = useState<IBookResponse[] | null>(null);
    const convertSentence = async () => {
        const vec_sentence = await vectorize(query);
        const first = vec_sentence[0]
        console.log(vec_sentence);
        const req = await fetch(import.meta.env.VITE_API_URL + 'api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(first)
        })
        const resp = await req.json()
        console.log(resp)
        setBooks(resp);
    }
    if (!extractor) {
        return(
            <div>
                <h1>Loading</h1>
            </div>
        )
    }
    return(
        <div className="w-full h-dvh bg-[#F8F6F2] flex flex-col items-center justify-center overflow-hidden pt-5 px-5">
            {!books && 
            <div className="md:w-2/3 py-5 space-y-3">
                <h2 className="text-5xl font-semibold">A <span className='underline'>{pageTitles[indexed]}</span>< br className="hidden md:block"/> with every PageTurn.</h2>
                <p className="text-lg text-gray-500">It's AI but not the kind you're thinking of.</p>
            </div>
            }
            {books && 
                <div className="w-full md:w-2/3 text-left pb-5">
                    <h2 className="text-3xl font-bold">PageTurn.</h2>
                </div>
            }
            <div className="flex flex-col items-end w-full md:w-2/3 rounded-xl border-2 border-solid border-gray-900 p-2">
                <textarea value={query} className="w-full bg-transparent resize-none h-10 focus:outline-none" placeholder="What kind of book do you want to read next?" onChange={(e) => setQuery(e.target.value)} />
                <button className="p-1 rounded-full bg-gray-900" onClick={() => convertSentence()}><ArrowRightIcon className="text-white text-sm" /></button>
            </div>
            {!books && 
            <>
                <div className="flex flex-wrap md:w-2/3 text-left py-3 gap-3 max-md:text-sm">
                    <button onClick={()=>setQuery("The city has secrets—and they’re alive.")} className="px-4 py-2 bg-black rounded-full text-white">
                        The city has secrets—and they’re alive.
                    </button>
                    <button onClick={()=>setQuery("What if your dreams showed the future?")} className="px-4 py-2 bg-black rounded-full text-white">
                        What if your dreams showed the future?
                    </button>
                    <button onClick={()=>setQuery("A romance that shouldn't have happened.")} className="px-4 py-2 bg-black rounded-full text-white">
                    A romance that shouldn't have happened.
                    </button>
                    <button onClick={()=>setQuery("Love. Death. Robots.")} className="px-4 py-2 bg-black rounded-full text-white">
                    Love. Death. Robots.
                    </button>
                </div>
            </>
            }
            {books && 
            <>
                <div className="md:w-2/3 text-left">
                    <h2 className="py-7 text-2xl font-bold">Here's some books we'd recommend:</h2>
                </div>
                <div className="flex flex-col md:w-2/3 overflow-y-auto relative">
                        {books && 
                            books.map((book)=>{
                                return(
                                    <div className="flex flex-col bg-transparent rounded-xl p-5 mb-4 border-2 border-solid border-gray-900 gap-2">
                                        <div>
                                            <h2 className="font-bold">{book.title}</h2>
                                            <h2 className="text-slate-600">{book.author}</h2>
                                        </div>
                                        <h2>{book.desc}</h2>
                                    </div>
                                )
                            })
                        }
                </div>
            </>
            }

        </div>
    )
}