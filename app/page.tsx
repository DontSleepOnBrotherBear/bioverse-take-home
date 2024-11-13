import Image from "next/image";
import Login from "../components/Login";

import { createClient } from './utils/supabase/server';

//table 1 - questionaire junction 
    // columns(4): 
        //id, 
        //questionaire_id(fk), 
        //question_id(fk), 
        //priority 

//table 2 - questionaires 
    // columns(2): 
      // id, 
      // name
    
//table 3 - user
    // columns
        // id,
        // name,

//table 4 - questions 
    // columns
        // id, 
        // question_type,
        // question_text,
        // question_options,

//table 5 - answers 
    // columns
        // id,
        // user_id(fk)
        // question_id(fk)
        // questionaire_id(fk)
        // answer_text,

//table 6 - completed questionaires
    // columns
        // id,
        // user_id(fk)
        // questionaire_id(fk)
        // completed_at

export default async function Home() {

  return (
    <div className="min-h-screen bg-amber-100">


      <Login />
    
    </div>
  );
}


