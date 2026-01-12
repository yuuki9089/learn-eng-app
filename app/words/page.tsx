import Sidebar from "@/components/sidebar";
import MainPanel from "@/components/mainpanel";
import SubPanel from "@/components/subpanel";

export default async function Words() {

  return (
    <>
      <div className="flex bg-[#f9fafb]">
        <Sidebar />
        {/* <h1>ここは英単語</h1> */}
          <MainPanel
            title={"英単語"}
          />
          <SubPanel />
        </div>
    </>
  );
}