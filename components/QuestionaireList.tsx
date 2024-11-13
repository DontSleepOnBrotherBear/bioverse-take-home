import { createClient } from '../app/utils/supabase/server';
import QuestionaireButton from './QuestionaireButton';


export default async function QuestionaireList({userId}: {userId: number}) {

    const supabase = await createClient();
    const { data: questionaires } = await supabase.from("questionaires").select();


    return (
        <div className="bg-cyan-600 flex flex-col justify-center w-48 mx-auto py-10 text-center">
    
            <p>userId: {userId}</p>

            <ul>
                {questionaires?.map((q) => (
                    <li key={q.id}>
                        <QuestionaireButton q_id={q.id} name={q.name} />
                    </li>
                ))}
            </ul>
        </div>

    );

}
