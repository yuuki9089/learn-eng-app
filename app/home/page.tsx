import Sidebar from "@/components/sidebar";

export default async function Settings() {

    return (
        <>
            <div className="flex">
                <Sidebar />
                <h1>ここはホーム</h1>
            </div>
        </>
    );
}