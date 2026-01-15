import Container from '@mui/material/Container';
import CheckBox from '@mui/material/Checkbox';
import { Check, Home, LogOut, Settings, BookOpen, FileText, MessageSquare, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormGroup } from '@mui/material';

type MainPanelProps = {
    title: string;
};

export default function MainPanel(props: MainPanelProps) {
    return (
        <>
            {/* Main */}
            <main className="flex-1 flex gap-6 p-8">
                {/* Center content */}
                <Card className="flex-1">

                    <div className="flex justify-between items-start px-5">
                        <div>
                            <h2 className="text-3xl font-bold">タイトル</h2>
                        </div>
                        <div className="text-right text-xl text-muted-foreground">
                            <div>No.100</div>
                            <div>2025/11/3</div>
                        </div>
                    </div>

                    <div className="h-full flex flex-col justify-between">
                        <CardContent className="p-8 space-y-6">
                            <p className="text-xl text-muted-foreground">次のお題を翻訳してください。</p>
                            <div className="w-full flex items-center gap-3 flex justify-between">

                                <p className="text-2xl font-semibold">This is a pen.</p>
                                <div className="mt-auto pt-6 flex gap-3 items-center">
                                    <Volume2 size={22} className="cursor-pointer" />
                                    <CheckBox color='success'/>
                                    {/* <Check className="text-green-500" /> */}
                                </div>
                            </div>


                            <Input placeholder="ここに回答を入力" />


                            <Button className="mx-auto block">採点</Button>

                            <div className='space-y-6 py-8'>
                                {/* AI Result */}
                                <div className="border border-green-300 bg-green-50 rounded-xl p-4">
                                    <p className="font-semibold text-green-600">AI採点結果：80%</p>
                                    <p className="text-sm mt-1">ここにアドバイスが入る</p>
                                </div>


                                {/* Model Answer */}
                                <div className="border border-blue-300 bg-blue-50 rounded-xl p-4">
                                    <p className="font-semibold text-blue-600">模範解答</p>
                                    <p className="text-sm mt-1">ここに模範解答が入る</p>
                                </div>
                            </div>
                        </CardContent>

                        <CardContent className="space-y-6">
                            <div className="mt-auto flex justify-between pt-6">
                                <Button variant="destructive">スキップ</Button>
                                <Button>Next</Button>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </main>
        </>
    );
}