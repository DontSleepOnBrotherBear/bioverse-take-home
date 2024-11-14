
import { createClient } from '../utils/supabase/server';
import AdminPanelTable from '@/components/AdminPanelTable';
import { UserData } from '../types/UserData';


export default async function Admin_Panel() {

    const supabase = await createClient();

    //get all the users 
    const { data: users, error: usersError } = await supabase.from('users').select();
    const { data: questionaires, error: questionairesError } = await supabase.from('questionaires').select();
    const { data: completedQuestionaires, error: completedQuestionnairesError } = await supabase.from('completed_questionaires').select();

    if (users === null) {
        return <div>loading...</div>;
    }

    let userData: UserData[] = users.map((user) => {
        return {
            key: user.id,
            name: user.name,
            email: user.email,
        };
    });

    //loop through userData and add the questionaire results to each user
    userData = userData.map((user) => {

        if (completedQuestionaires === null || questionaires === null) {
            return user;
        }
        const userQuestionaireResults = completedQuestionaires.filter((completedQuestionaire) => {
            return completedQuestionaire.user_id === user.key;
        });

        questionaires.forEach((questionaire) => {
            const questionaireResult = userQuestionaireResults.find((result) => {
                return result.questionaire_id === questionaire.id;
            });

            if (questionaireResult) {
                user[questionaire.id] = 'Completed';
            } else {
                user[questionaire.id] = "-";
            }
        });

        return user;
    });


    return (
        <div className=" flex flex-col justify-center w-full mx-auto py-10 px-3 " style={{maxWidth: '1000px'}}>
           <p className='text-xl font-bold mx-3 my-3'>Admin Panel</p>
           <div className='overflow-x-auto border rounded-md'>
              {questionaires && <AdminPanelTable userData={userData} questionaires={questionaires} />}
            </div>
        </div>

    );
    
}
