import QuestionaireList from "@/components/QuestionaireList";


export default function QU_Select() {


    return (
        <div className=" flex flex-col justify-center w-full mx-auto py-10 text-center">
           <p>Select a Questionaire </p>
            <QuestionaireList userId={1} />
        </div>           

    );

}
