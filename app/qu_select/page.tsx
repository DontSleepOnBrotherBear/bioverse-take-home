import QuestionaireList from "@/components/QuestionaireList";

import { createClient } from '../utils/supabase/server';



export default async function QU_Select() {

    const supabase = await createClient();
    let userId: number = 1; //using a workaround for auth
    let userEmail = ''; //using a workaround for auth

    //lil workaround for auth
    const { data: authWorkaround } = await supabase.from('auth_workaround').select('id,logged_in_currently').limit(1);
    if (!authWorkaround) {
        return (
            <div className=" flex flex-col justify-center w-48 mx-auto py-10 text-center">
                <p>404 - Page not found</p>
            </div>
        );
    }   
    if (authWorkaround[0].logged_in_currently === 'user1@gmail.com') {
        userEmail = 'user1@gmail.com';
        userId = 1;
    } else if (authWorkaround[0].logged_in_currently === 'user2@gmail.com') {
        userEmail = 'user2@gmail.com';
        userId = 2;
    } else {
        return (
            <div className=" flex flex-col justify-center w-48 mx-auto py-10 text-center">
                <p>Go back to the login page and log in as one of the test users!</p>
            </div>
        );
    }


   
    return (
        <div className=" flex flex-col justify-center w-full mx-auto py-10 text-center bg-gradient-to-r from-slate-100 to-blue-100 min-h-screen">
           <p className="font-bold text-2xl bg-none">Select a Questionaire </p>
            <QuestionaireList userId={userId} userEmail={userEmail} />
        </div>           
    );

}
