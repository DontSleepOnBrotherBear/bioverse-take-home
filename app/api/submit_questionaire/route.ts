
import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';


export async function POST(request: Request) {
  const supabase = await createClient();

  try {

    const body = await request.json();

    //add a new completed questionaire row
    const { data: cqData, error: cqError } = await supabase.from('completed_questionaires')
    .insert([
      { 
        user_id: body.user_id,
        questionaire_id: body.questionaire_id,
        completed_at: new Date().toISOString(),
      },
    ])
    .select()

    //add answers to answer trable
    const answerData = body.answers.map((answer: { questionId: string, inputAnswer?: string, mcqAnswers?: string[] }) => ({
      user_id: body.user_id,
      question_id: answer.questionId,
      questionaire_id: body.questionaire_id,
      answer_text: answer.inputAnswer ? answer.inputAnswer : answer.mcqAnswers
    }));
    const { data: ansData, error: ansError } = await supabase
    .from('answers')
    .insert(answerData)
    .select()

    return NextResponse.json({ message: 'questionaire submitted successfully' });
   
  } catch (error) {
    console.error('error submitting questionaire:', error);
    return NextResponse.json({ error: 'error submitting questionaire' }, { status: 500 });
  }
}
