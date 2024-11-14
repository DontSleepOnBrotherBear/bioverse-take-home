
import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

const supabase = await createClient();


export async function POST(request: Request) {
  try {

    const body = await request.json();
    console.log('body: ', body);

    // Insert the questionaire answers into the database
    const { data, error } = await supabase
    .from('completed_questionaires')
    .insert([
      { user_id: 1, questionaire_id: 1},
    ])
    .select()

            
    return NextResponse.json({ message: 'Questionaire submitted successfully' });
   
  } catch (error) {
    console.error('Error submitting questionaire:', error);
    return NextResponse.json({ error: 'Failed to submit questionaire' }, { status: 500 });
  }
}
