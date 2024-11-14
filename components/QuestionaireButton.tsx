"use client";

import { useRouter } from 'next/navigation'
import { makeFirstLetterUpperCase } from '../app/utils/helpers';


export default function QuestionaireButton({q_id, name}: {q_id: number, name: string}) {

    const router = useRouter();

    const onClick = () => {
        router.push(`/questionaire/${q_id}`);
    }
    return (

        <button className="bg-cyan-100 hover:bg-cyan-200 flex flex-col justify-center w-60 mx-auto py-3 text-center my-4 border" onClick={onClick}>
            <p>{makeFirstLetterUpperCase(name)} Questionaire</p>
        </button>

    );

}


