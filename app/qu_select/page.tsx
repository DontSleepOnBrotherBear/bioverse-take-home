import QuestionaireList from "@/components/QuestionaireList";


export default function QU_Select() {


    return (
        <div className="bg-cyan-200 flex flex-col justify-center w-48 mx-auto py-10 text-center">
           <p>Select a Questionaire </p>
            <QuestionaireList userId={1} />
        </div>

    );

}
