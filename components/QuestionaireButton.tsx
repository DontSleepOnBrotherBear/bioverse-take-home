"use client";

import { useRouter } from 'next/navigation'
import { makeFirstLetterUpperCase } from '../app/utils/helpers';


export default function QuestionaireButton({q_id, name}: {q_id: number, name: string}) {

    const router = useRouter();

    const onClick = () => {
        router.push(`/questionaire/${q_id}`);
    }
    return (

        <button className="bg-cyan-800 hover:bg-cyan-700 text-white font-bold flex flex-col justify-center w-60 mx-auto py-3 text-center rounded-md shadow-sm" onClick={onClick}>
            <div className='flex flex-row justify-center gap-1  mx-auto'>
                <p>{makeFirstLetterUpperCase(name)} </p>
                <p>Questionaire</p>
            </div>
        </button>

    );

}


