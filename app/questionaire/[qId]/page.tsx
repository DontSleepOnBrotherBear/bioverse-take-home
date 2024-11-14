import { createClient } from '../../utils/supabase/server';
import QuestionaireForm from '@/components/QuestionaireForm';
import { makeFirstLetterUpperCase } from '../../utils/helpers';
import { type Question } from '../../types/Question';

interface QuestionaireProps {
    params: {
        qId: string;
    };
}

export default async function Page({ params }: QuestionaireProps) {

    const { qId } =  params 
    const questionaireId = parseInt(qId);
    const supabase = await createClient();

    let userId: number = 1; //using a workaround for auth
    let userEmail = ''; //using a workaround for auth
    const { data: authWorkaround } = await supabase.from('auth_workaround').select('id,logged_in_currently').limit(1);
    if (!authWorkaround) {
        return (
            <div className=" flex flex-col justify-center w-48 mx-auto py-10 text-center">
                <p>404 - Page not found</p>
            </div>
        );
    }
    if (authWorkaround[0].logged_in_currently === 'user1@gmail.com') {
        userId = 1;
        userEmail = 'user1@gmail.com';
    } else if (authWorkaround[0].logged_in_currently === 'user2@gmail.com') {
        userId = 2;
        userEmail = 'user2@gmail.com'
    } else {
        return (
            <div className=" flex flex-col justify-center w-48 mx-auto py-10 text-center">
                <p>Go back to the login page and log in as one of the test users!</p>
            </div>
        );
    }





    //get the name of the questionaire
    const { data: questionaire_name } = await supabase.from('questionaires').select('name').eq('id', questionaireId);

    //look at the questionaire junction and see which question ids are associated with the current questionaire id
    const { data: questionIdsWithPriority } = await supabase.from("questionaire_junction").select('question_id, priority').eq('questionaire_id', questionaireId);
    if (!questionIdsWithPriority || questionIdsWithPriority.length === 0 || !questionaire_name) {
        return (
            <div className=" flex flex-col justify-center w-48 mx-auto py-10 text-center">
                <p>404 - Page not found</p>
            </div>
        );
    }
    let questionIdsOnly = questionIdsWithPriority.map((q) => q.question_id);

    //only select rows where the question_id is in the array of question ids
    let {data: questions} = await supabase.from('questions').select().in('id', questionIdsOnly);
    if (!questions) {
        return (
            <div className=" flex flex-col justify-center w-48 mx-auto py-10 text-center">
                <p>404 - Page not found</p>
            </div>
        );
    }

    //sort the questions by priority
    const priorityMap = Object.fromEntries(
        questionIdsWithPriority.map(({ question_id, priority }) => [question_id, priority])
    );
    const sortedQuestions = questions.sort((a, b) => {
        const priorityA = priorityMap[a.id] ?? Number.NEGATIVE_INFINITY;
        const priorityB = priorityMap[b.id] ?? Number.NEGATIVE_INFINITY;
        return priorityB - priorityA;
    });

    //see if the user has answered any of these questions before in other questionaires to prefill the answers
    let updatedQuestions = [];
    const {data: userAnswers} = await supabase.from('answers').select('question_id, answer_text').eq('user_id', userId); 
    if (userAnswers && userAnswers.length > 0) {
        updatedQuestions = sortedQuestions.map((q) => {
            let qId = q.id;
            let userAnswer = userAnswers.find((a) => a.question_id === qId);
            if (userAnswer) {
                q.placeholder_value = userAnswer.answer_text;
            }
            return q;
        });
    }

    return (

        <div className='flex flex-col w-full  pt-4 pb-10 px-5 bg-gradient-to-r from-slate-100 to-blue-100' >
            <div className="bg-cyan-700 text-white rounded-md font-bold flex flex-col justify-center w-60 mx-auto py-3 text-center">
                {makeFirstLetterUpperCase(questionaire_name[0].name)} Questionaire
            </div>
            <p className='text-center w-full text-xs mt-2'>Logged in as {userEmail} </p>

            {
                questions && 
                <QuestionaireForm 
                    questionaireId={questionaireId}
                    questions={updatedQuestions.length > 0 ? updatedQuestions : sortedQuestions as Question[]} 
                    userId={userId}
                />
            }
        </div>
    );
}
