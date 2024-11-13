
interface QuestionaireProps {
    params: {
        questionaireId: string;
    };
}

export default function Page({ params }: QuestionaireProps) {
    const { questionaireId } = params;
  
    return (
        <div className="bg-cyan-200 flex flex-col justify-center w-48 mx-auto py-10">
            Questionaire ID: {questionaireId}
        </div>
    );
}
