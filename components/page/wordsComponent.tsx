"use client"

import { PageMode } from "@/types/pageMode";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Home, LogOut, Settings, BookOpen, FileText, MessageSquare, Volume2 } from "lucide-react";
import CheckBox from '@mui/material/Checkbox';

export default function WordsComponent() {
    return (
        <>
            {/* Main */}
            < main className="flex-1 flex gap-6 p-8" >
                {/* Center content */}
                < Card className="flex-1" >

                    <div className="flex justify-between items-start px-5">
                        <div>
                            <h2 className="text-3xl font-bold">英単語</h2>
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
                                    <CheckBox color='success' />
                                    {/* <Check className="text-green-500" /> */}
                                </div>
                            </div>

                            {/* 4択の表示 (英単語のみ)*/}
                            {
                                <div className='w-full flex flex-col gap-5'>
                                    <div className='flex flex-wrap px-5 justify-center gap-8'>
                                        <Card className='w-2/5 bg-[#0f172a]'>
                                            <CardContent>
                                                <CardTitle className='text-center'>
                                                    <p className="text-xl text-muted-foreground">次のお題を翻訳してください。</p>
                                                </CardTitle>
                                            </CardContent>
                                        </Card>
                                        <Card className='w-2/5 bg-[#0f172a]'>
                                            <CardContent>
                                                <CardTitle className='text-center'>
                                                    <p className="text-xl text-muted-foreground">次のお題を翻訳してください。</p>
                                                </CardTitle>
                                            </CardContent>
                                        </Card>
                                        <Card className='w-2/5 bg-[#0f172a]'>
                                            <CardContent>
                                                <CardTitle className='text-center'>
                                                    <p className="text-xl text-muted-foreground">次のお題を翻訳してください。</p>
                                                </CardTitle>
                                            </CardContent>
                                        </Card>
                                        <Card className='w-2/5 bg-[#0f172a]'>
                                            <CardContent>
                                                <CardTitle className='text-center'>
                                                    <p className="text-xl text-muted-foreground">次のお題を翻訳してください。</p>
                                                </CardTitle>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            }

                            <div className='space-y-6 py-8'>
                                {/* AI Result */}
                                <div className="border border-green-300 bg-green-50 rounded-xl p-4">
                                    <p className="font-semibold text-green-600">AI採点結果：80%</p>
                                    <p className="text-sm mt-1">ここにアドバイスが入る</p>
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
                </Card >
            </main >
        </>
    );
}