import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubPanel() {
    return (
        <>
            {/* Right panel */}
            <Card className="w-100">
                <CardContent className="p-6 space-y-4">
                    <div className="flex gap-4 border-b pb-2 text-sm font-semibold">
                        <span className="border-b-2 border-black">AIチャット</span>
                        <span className="text-muted-foreground">出題履歴</span>
                    </div>


                    <Button variant="outline" className="w-full">不正解</Button>


                    <HistoryItem no="No.100" text="example 1" ok />
                    <HistoryItem no="No.101" text="example 2" />
                </CardContent>
            </Card>
        </>
    );

    function HistoryItem({ no, text, ok }: any) {
        return (
            <div className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                    <p className="text-xs text-muted-foreground">{no}</p>
                    <p className="text-sm font-medium">{text}</p>
                </div>
                <div className={ok ? "text-green-500" : "text-red-500"}>
                    {ok ? "○" : "×"}
                </div>
            </div>
        );
    }
}