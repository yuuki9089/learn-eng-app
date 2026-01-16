import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CardHeader } from "@mui/material";
import { Button } from "@/components/ui/button";
import { PageMode } from "@/types/pageMode";
import Link from "next/link";

export default async function Settings() {

    return (
        <>
            <div className="flex bg-[#f9fafb]">
                <Sidebar />
                {/* 英単語 */}
                <div className="flex flex-col w-full">
                    <h1 className="text-3xl pt-8 pl-5 font-bold">ホーム</h1>
                    <div className="flex">
                        <div className="w-full p-8">
                            <Card className="w-full shadow-xl border-[#9f9f9f] border-[2px]">
                                <CardTitle className="pl-5 text-3xl">
                                    英単語
                                </CardTitle>
                                <CardContent className="text-xl text-[#6d7583]">
                                    4択でクイズ形式で覚える英単語
                                </CardContent>
                                <div className="px-8">
                                    <Link href={"/words"}>
                                        <Button className="w-full">開く</Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                        <div className="w-full p-8">
                            <Card className="w-full shadow-xl border-[#9f9f9f] border-[2px]">
                                <CardTitle className="pl-5 text-3xl">
                                    フレーズ
                                </CardTitle>
                                <CardContent className="text-xl text-[#6d7583]">
                                    登録した単語から1文を出題
                                </CardContent>
                                <div className="px-8">
                                    <Link href={"/phrases"}>
                                        <Button className="w-full">開く</Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                        <div className="w-full p-8 ">
                            <Card className="w-full shadow-xl border-[#9f9f9f] border-[2px]">
                                <CardTitle className="pl-5 text-3xl">
                                    センテンス
                                </CardTitle>
                                <CardContent className="text-xl text-[#6d7583]">
                                    200語程度の短文の読解問題
                                </CardContent>
                                <div className="px-8">
                                    <Link href={"/short-texts"}>
                                        <Button className="w-full">開く</Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}