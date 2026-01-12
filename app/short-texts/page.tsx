import Sidebar from "@/components/sidebar";

export default async function ShortTexts() {

  return (
    <>
      <div className="flex">
        <Sidebar />
        <h1>ここは短文</h1>
      </div>
    </>
  );
}