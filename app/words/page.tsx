import Sidebar from "@/components/sidebar";
import SubPanel from "@/components/subpanel";
import WordsComponent from "@/components/page/wordsComponent";
import { auth } from "@/auth";
import { PageMode } from "@/types/pageMode";

export default async function Words() {
  const session = await auth();

  return (
    <>
      <div className="flex bg-[#f9fafb]">
        <Sidebar />
        {/* email or 空文字列 */}
        <WordsComponent user_id={session?.user?.email || ''}/>
        <SubPanel user_id={session?.user?.email || ''} page_mode={PageMode.WORDS}/>
      </div>
    </>
  );
}