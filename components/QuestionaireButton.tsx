"use client";

import { useRouter } from 'next/navigation'


export default function QuestionaireButton({q_id, name}: {q_id: number, name: string}) {

    const router = useRouter();

    const onClick = () => {
        router.push(`/questionaire/${q_id}`);
    }
    return (

        <button className="bg-cyan-100 hover:bg-cyan-200 flex flex-col justify-center w-48 mx-auto py-3 text-center my-4 border" onClick={onClick}>
            <p>q_id: {q_id}</p>
            <p>name: {name}</p>
        </button>

    );

}


