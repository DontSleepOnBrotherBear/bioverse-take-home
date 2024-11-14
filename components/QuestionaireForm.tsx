'use client'

import { useState, useEffect } from 'react';
import { type Question } from '../app/types/Question';

//data type that will be sent to the backend with the answers
type QandA = {
    questionId: number;
    inputAnswer: string;
    mcqAnswers: string[];
}


export default function QuestionaireForm({ questions }: { questions: Question[] }) {

    console.log('questions:', questions);

    const [selectedOptions, setSelectedOptions] = useState<QandA[]>([]);
    const [inputAnswers, setInputAnswers] = useState<QandA[]>([]);
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = () => {
        setLoading(true);

        //combine the selectedOptions and inputAnswers states into one array
        const allAnswers = [...selectedOptions, ...inputAnswers];

        //send the answers to the db
        fetch('/api/submit_questionaire', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(allAnswers),
        })
        .then((response) => {
            if (response.ok) {
                console.log('Answers submitted successfully');
            } else {
                console.error('Failed to submit answers');
            }
        })
        .catch((error) => {
            console.error('Error submitting answers:', error);
        })
          
        setLoading(false);
    }

    useEffect(() => {
        console.log('selectedOptions:', selectedOptions);
        console.log('inputAnswers:', inputAnswers);
    }, [selectedOptions]);


    return (
        <>
        {questions && questions.map ((q: any) => (
            <div key={q.id} className=" flex flex-col justify-center w-48 mx-auto py-3 text-center w-full text-center my-3  bg-slate-50 shadow-md "  style={{maxWidth: '600px'}}>

                <p className='text-xl font-bold mb-3 mx-3'>{q.question_text}</p>

                {q.question_type === 'mcq' && (
                    <div className="flex flex-col w-full px-2 mx-auto "  style={{maxWidth: '300px'}}>
                         {q.question_options.map((option: string, index: number) => (
                            <label key={`${q.id}-${index}`} className="flex text-start space-x-2  cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={option}
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
                        <textarea className=' p-2 border' placeholder="Type your answer..." rows={4} onChange={(e) => handleInputAnswerChange(q.id, e.target.value)} />
                    </div>
                )}
    
            </div>
        ))}

        <button 
            className="bg-cyan-900 hover:bg-cyan-800 text-white flex flex-col justify-center w-48 mx-auto py-2 text-center mt-4"
            onClick={handleSubmit}
        >
            Submit
        </button>
        </>
    );

}