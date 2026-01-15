import Sidebar from "@/components/sidebar";
import MainPanel from "@/components/mainpanel";
import SubPanel from "@/components/subpanel";
import { PageMode } from "@/types/pageMode";


export default async function Phrases() {

  return (
    <>
      <div className="flex bg-[#f9fafb]">
        <Sidebar />
        {/* <h1>ここはフレーズ</h1> */}
          <MainPanel
            title={PageMode.PHRASES}
          />
          <SubPanel />
        </div>
    </>
  );
}