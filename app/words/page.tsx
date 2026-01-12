import Sidebar from "@/components/sidebar";

export default async function Words() {

  return (
    <>
      <div className="flex">
        <Sidebar />
        <h1>ここは英単語</h1>
      </div>
    </>
  );
}