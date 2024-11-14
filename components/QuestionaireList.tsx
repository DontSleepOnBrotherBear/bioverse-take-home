import { createClient } from '../app/utils/supabase/server';
import QuestionaireButton from './QuestionaireButton';
import {formatTimestampToReadableDate} from '../app/utils/helpers';


export default async function QuestionaireList({userId}: {userId: number}) {

    const supabase = await createClient();
    const { data: questionaires } = await supabase.from("questionaires").select();
    if (!questionaires || questionaires.length === 0) {
        return (
            <div className=" flex flex-col justify-center w-48 mx-auto py-10 text-center">
                <p>404 - Page not found</p>
            </div>
        );
    }

    //check if the user has completed the questionaire
    const { data: completed_questionaires } = await supabase.from('completed_questionaires').select('questionaire_id').eq('user_id', userId);

    //add completed and completed_at fields to questionaire data
    let questionaire_data = questionaires
    if (completed_questionaires && completed_questionaires.length !== 0) { 
        for (const q of questionaires) {
            if (completed_questionaires.find((cq) => cq.questionaire_id === q.id)) {
                questionaire_data.find((qu) => q.id === qu.id).completed = true;
                questionaire_data.find((qu) => q.id === qu.id).completed_at = q.created_at;
            }
        }
    }


    return (
        <div className="flex flex-col justify-center items-center w-48 mx-auto py-10 text-center">
    
            <p className=''>userId: {userId}</p>

            {questionaire_data?.map((q) => (
                <div key={q.id} className="my-6 text-start">
                    <QuestionaireButton q_id={q.id} name={q.name} />
                    {q.completed ? (
                        <div className='flex flex-row mt-1 pl-1'>
                            <img src='/checkmark.png' className='w-5 h-5' />
                            <p className='text-xs ml-1 ' style={{marginTop: '2px'}}>{formatTimestampToReadableDate(q.completed_at)}</p>
                        </div>
                    ) : (
                        <p className='text-xs rounded-sm w-fit mx-auto px-2 mt-1 text-center bg-yellow-400'>Not completed yet! </p>
                    )}
                </div>

            ))}
           
        </div>

    );

}
