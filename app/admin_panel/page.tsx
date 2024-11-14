
import { createClient } from '../utils/supabase/server';

export default async function Admin_Panel() {

    const supabase = await createClient();

    //get all the users 
    const { data: usersData, error: usersError } = await supabase.from('users').select();
    console.log("users data: ", usersData);


    


    return (
        <div className="bg-cyan-200 flex flex-col justify-center w-48 mx-auto py-10">
           Admin Panel
        </div>

    );
    
}
