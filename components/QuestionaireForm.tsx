'use client'

import { useState, useEffect } from 'react';
import { type Question } from '../app/types/Question';
import { useRouter } from 'next/navigation'


//data type that will be sent to the backend with the answers
type QandA = {
    questionId: number;
    inputAnswer: string;
    mcqAnswers: string[];
}

export default function QuestionaireForm({ questionaireId, questions, userId}: { questionaireId: number, questions: Question[], userId: number }) {

    const router = useRouter();

    const [selectedOptions, setSelectedOptions] = useState<QandA[]>([]);
    const [inputAnswers, setInputAnswers] = useState<QandA[]>([]);
    const [loading, setLoading] = useState(false);

    //loop through all questions and set the initial state of selectedOptions and inputAnswers
    useEffect(() => {
        if (questions) {
            const initialSelectedOptions = questions
                .filter((q) => q.question_type === 'mcq')
                .map((q) => {
                    const questionId = q.id;
                    const mcqAnswers = Array.isArray(q.placeholder_value) ? q.placeholder_value : [];
                    return { questionId, inputAnswer: '', mcqAnswers: mcqAnswers };
                });
            setSelectedOptions(initialSelectedOptions);

            const initialInputAnswers = questions
                .filter((q) => q.question_type === 'input')
                .map((q) => {
                    const questionId = q.id;
                    const inputAnswer = q.placeholder_value ? q.placeholder_value : '';
                    return { questionId, inputAnswer, mcqAnswers: [] };
                });
            setInputAnswers(initialInputAnswers);
        }
    }, [questions]);


    //for handling the multiple choice question answers
    const handleOptionChange = (questionId: number, option: string) => {

        setSelectedOptions((prevSelected) => {
            //find the index of the question in the selectedOptions state
            const questionIndex = prevSelected.findIndex((q) => q.questionId === questionId);
            //check if the index corresponds to a question that's already in selectedOptions
            if (questionIndex !== -1) {
                const question = prevSelected[questionIndex];
                const mcqAnswers = question.mcqAnswers.includes(option) // check if the option is already selected for the question
                    ? question.mcqAnswers.filter((answer) => answer !== option) // if option is already selected, remove it
                    : [...question.mcqAnswers, option]; // if the option isn't selected yet, add it
                const updatedQuestion = { ...question, mcqAnswers };
                return [
                    ...prevSelected.slice(0, questionIndex),
                    updatedQuestion,
                    ...prevSelected.slice(questionIndex + 1),
                ];
            } else {
                //if the question wasn't in selectedOptions yet, just add it with the chosen option
                return [...prevSelected, { questionId, inputAnswer: '', mcqAnswers: [option] }];
            }
        });
    };

    //for handling text input answers
    const handleInputAnswerChange = (questionId: number, inputAnswer: string) => {

        setInputAnswers((prevAnswers) => {
            //find the index of the question in the inputAnswers state
            const questionIndex = prevAnswers.findIndex((q) => q.questionId === questionId);
            //check if the index corresponds to a question that's already in inputAnswers
            if (questionIndex !== -1) {
                const updatedQuestion = { ...prevAnswers[questionIndex], inputAnswer };
                return [
                    ...prevAnswers.slice(0, questionIndex),
                    updatedQuestion,
                    ...prevAnswers.slice(questionIndex + 1),
                ];
            } else {
                //if the question wasn't in inputAnswers yet, just add it with the input answer
                return [...prevAnswers, { questionId, inputAnswer, mcqAnswers: [] }];
            }
        });
    };

    const handleSubmit = async () => {
        setLoading(true);

        //combine the selectedOptions and inputAnswers states into one array
        const allAnswers = [...selectedOptions, ...inputAnswers];

        //make sure every question has an answer
        if (!allAnswers.length) {
            alert('Please answer all questions');
            setLoading(false);
            return;
        }
        for (const answer of allAnswers) {
            if (!answer.mcqAnswers.length && !answer.inputAnswer) {
                alert('Please answer all questions');
                setLoading(false);
                return;
            }
        }

        const questionnaireSubmission = {
            user_id: userId, 
            questionaire_id: questionaireId,
            answers: allAnswers
        }

        //send the answers to the db
        await fetch('/api/submit_questionaire', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionnaireSubmission),
        })
        .then((response) => {
            if (response.ok) {
                console.log('Answers submitted successfully');
                window.location.href = '/qu_select'; 

            } else {
                console.error('Failed to submit answers');
                setLoading(false);
                alert('Failed to submit answers, please try again');
            }
        })
        .catch((error) => {
            console.error('Error submitting answers:', error);
            setLoading(false);
        })
          
    }


    return (
        <>
       
        {loading ? <p className='text-2xl font-bold animate-pulse pt-36 text-center bg-gradient-to-r from-slate-100 to-blue-100 min-h-screen'>Submitting...</p> : (

            <>
                {questions && questions.map ((q: any) => (
                    <div key={q.id} className=" flex flex-col justify-center w-48 mx-auto py-3 text-center w-full text-center my-3  bg-slate-50 shadow-md rounded-md"  style={{maxWidth: '600px'}}>

                        <p className='text-xl font-bold mb-3 mx-3'>{q.question_text}</p>

                        {q.question_type === 'mcq' && (
                            <div className="flex flex-col w-full px-2 mx-auto "  style={{maxWidth: '300px'}}>
                                {q.question_options.map((option: string, index: number) => (
                                    <label key={`${q.id}-${index}`} className="flex text-start space-x-2  cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value={option}
                                            defaultChecked={q.placeholder_value ? q.placeholder_value.includes(option) : false}
                                            onChange={() => handleOptionChange(q.id, option)}
                                            className=""
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {q.question_type === 'input' && (
                            <div className="flex flex-col justify-center w-full mx-auto py-3 mx-auto px-3 text-center" style={{maxWidth: '500px'}}>
                                <textarea 
                                    className=' p-2 border' 
                                    defaultValue={q.placeholder_value ? q.placeholder_value : ''}
                                    placeholder={q.placeholder_value ? "" : 'Type your answer here...'}
                                    rows={4} 
                                    onChange={(e) => handleInputAnswerChange(q.id, e.target.value)} />
                            </div>
                        )}
            
                    </div>
                ))}

                <button 
                    className="bg-cyan-900 font-bold rounded-md hover:bg-cyan-800 text-white flex flex-col justify-center w-fit px-10 mx-auto py-2 text-center mt-3"
                    onClick={handleSubmit}
                >
                    Submit
                </button>

            </>

        )}

        
        </>
    );

}