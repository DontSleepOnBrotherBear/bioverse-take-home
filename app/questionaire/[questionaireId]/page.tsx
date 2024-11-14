import { createClient } from '../../utils/supabase/server';
import QuestionaireForm from '@/components/QuestionaireForm';
import { makeFirstLetterUpperCase } from '../../utils/helpers';
import { type Question } from '../../types/Question';

interface QuestionaireProps {
    params: {
        questionaireId: number;
    };
}



export default async function Page({ params }: QuestionaireProps) {

    const { questionaireId } = await params;
    const supabase = await createClient();

    //get the name of the questionaire
    const { data: questionaire_name } = await supabase.from('questionaires').select('name').eq('id', questionaireId);

    //look at the questionaire junction and see which question ids are associated with the current questionaire id
    const { data: questionIds } = await supabase.from("questionaire_junction").select('question_id').eq('questionaire_id', questionaireId);

    //if there are no questions or question name, give 404
    if (!questionIds || questionIds.length === 0 || !questionaire_name) {
        return (
            <div className=" flex flex-col justify-center w-48 mx-auto py-10 text-center">
                <p>404 - Page not found</p>
            </div>
        );
    }
   
    let justTheIds = questionIds.map((q) => q.question_id);

    //only select rows where the question_id is in the array of question ids
    const {data: questions} = await supabase.from('questions').select().in('id', justTheIds);

 
    //filter the questions by priority

    return (

        <div className='flex flex-col w-full py-10 px-5'>
            <div className="bg-cyan-400 flex flex-col justify-center w-60 mx-auto py-3 text-center">
                {makeFirstLetterUpperCase(questionaire_name[0].name)} Questionaire
            </div>

            {questions && <QuestionaireForm questionaireId={questionaireId} questions={questions as Question[]} />}

        </div>
    );
}
