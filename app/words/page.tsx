import Sidebar from "@/components/sidebar";
import SubPanel from "@/components/subpanel";
import WordsComponent from "@/components/page/wordsComponent";


export default function Words() {

  return (
    <>
      <div className="flex bg-[#f9fafb]">
        <Sidebar />
        <WordsComponent />
        <SubPanel />
      </div>
    </>
  );
}