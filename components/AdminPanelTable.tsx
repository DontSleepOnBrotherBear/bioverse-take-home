"use client";
import * as React from "react";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'
import {makeFirstLetterUpperCase} from '../app/utils/helpers';
import { UserData, UserAnswer, type Questionaire } from '../app/types/UserData';

interface SupabaseConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
}

function SimpleModal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-fit mx-10 flex flex-col" style={{maxWidth: '500px', overflowY: 'scroll', maxHeight: '700px'}}>
                <button onClick={onClose} className=" text-sm font-bold w-fit ml-auto px-2 py-1 ">X</button>
                {children}
                <button onClick={onClose} className=" mt-3 font-bold bg-cyan-800 hover:bg-cyan-700 w-fit mx-auto p-2 text-white rounded-md">Close</button>
            </div>
        </div>
    );
}


export default function AdminPanelTable({ userData, questionaires }: { userData: UserData[]; questionaires: Questionaire[] }) {

    const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestionaireResults, setSelectedQuestionaireResults] = useState<UserAnswer[]>([]);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [selectedQuestionaireName, setSelectedQuestionaireName] = useState('');
    const [loadingModal, setLoadingModal] = useState(false);

    //fetch the supabase config without exposing
    useEffect(() => {
        const fetchSupabaseConfig = async () => {
          try {
            const response = await fetch('/api/supabase_config', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json();
            setSupabaseConfig(data);
          } catch (error) {
            console.error("Error fetching Supabase config", error);
          }
        };
        fetchSupabaseConfig();
    }, []);

    if (!supabaseConfig) {
        return <div></div>;
    }
    const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey);

    const handleRecordClick = async (userId: number, questionaireId: number) => {
        setIsModalOpen(true);
        setLoadingModal(true);

        //get the user name and email with the user id
        const { data: user, error: userError } = await supabase.from('users').select('name, email').eq('id', userId);
        if (user === null) return;
        setSelectedUserName(user[0].name);
        setSelectedUserEmail(user[0].email);

        //get the questionaire name with the questionaire id
        const { data: questionaire, error: questionaireError } = await supabase.from('questionaires').select('name').eq('id', questionaireId);
        if (questionaire === null) return;
        setSelectedQuestionaireName(questionaire[0].name);

       //get all items in the 'answers' table that have the user id and questionaire matching
        let { data: answers, error: answersError } = await supabase.from('answers').select().eq('user_id', userId).eq('questionaire_id', questionaireId);
        if (answers === null) return;
        if (answers.length > 3) {
            //only include the most recent answers
            answers = answers.slice(answers.length - 3);
        }
        
        //get the question text for each answer
        let questionIds = answers.map((answer) => {
            return answer.question_id;
        });
        const { data: questions, error: questionsError } = await supabase.from('questions').select().in('id', questionIds);
        if (questions === null) return;
   
        //format the data to be displayed in the modal
        let userAnswers = answers.map((answer) => {
          
            return {
                questionaire: answer.questionaire_id,
                question: answer.question_id,
                answer: JSON.stringify(answer.answer_text),
                question_text: JSON.stringify(questions.find((question) => question.id === answer.question_id).question_text),
                question_type: questions.find((question) => question.id === answer.question_id).question_type,
            };
        })
        setSelectedQuestionaireResults(userAnswers);

        setLoadingModal(false);
    }
 
    //make the columns of the table
    const questionaireColumns = questionaires.map((questionaire) => {
        return {
            title: makeFirstLetterUpperCase(questionaire.name),
            dataIndex: questionaire.id.toString(),
            key: questionaire.id.toString(),
        };
    })
    const userColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ];
    const allColumns = userColumns.concat(questionaireColumns);


    return (
        <>
       
            <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {loadingModal ? <p className="h-full w-full text-center" style={{width: '200px', height: '200px'}}>Loading...</p> : (
                    <>
                    <p>User: {selectedUserName}</p>
                    <p>Email: {selectedUserEmail}</p>
                    <p>Questionaire: {makeFirstLetterUpperCase(selectedQuestionaireName)}</p>
                    {selectedQuestionaireResults.map((result) => (
                        <div key={result.question} className="my-2 bg-slate-100 p-2 shadow-md rounded-md">
                            <p className='font-bold'>Question: </p>
                            <p className="ml-3">{result.question_text}</p>
                            <p className='font-bold'>Answer: </p>
                            {result.question_type === 'mcq' ? ( 
                            <ul className="ml-3">
                                {JSON.parse(result.answer).map((ans: string, index: number) => (
                                    <li key={index}>-{ans}</li>
                                ))}
                            </ul>
                            ) : (
                                <p className="ml-3">{result.answer}</p>
                            )}
                        </div>
                    ))}
                    </>
                )}
            </SimpleModal>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            {allColumns.map((column) => (
                                <th
                                    key={column.key}
                                    className="py-3 px-4 bg-gray-200 border-b text-left text-sm font-semibold text-gray-600"
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user) => (
                            <tr key={user.key}>
                                {allColumns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="py-3 px-4 border-b text-sm text-gray-600"
                                    >
                                        {column.dataIndex === 'name' || column.dataIndex === 'email' ? (
                                            user[column.dataIndex]
                                        ) : (
                                            (user as any)[column.dataIndex] === '-' ? 'N/A' :
                                            <button 
                                                className='text-cyan-700 font-bold underline' 
                                                onClick={() => handleRecordClick(user.key, Number(column.dataIndex))}>{(user as any)[column.dataIndex]}
                                            </button>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )

}






