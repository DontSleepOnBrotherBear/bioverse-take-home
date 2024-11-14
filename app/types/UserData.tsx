


export interface UserData {
    key: number;
    name: string;
    email: string;
    [questionId: number]: string; 
  }
  
export interface UserAnswer {
    questionaire: any;
    question: any;
    answer: string;
    question_text: string;
    question_type: string;
}

export type Questionaire = {
  created_at: string;
  id: number;
  name: string;
};