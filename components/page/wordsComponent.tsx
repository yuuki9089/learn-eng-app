"use client"

import { PageMode } from "@/types/pageMode";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Home, LogOut, Settings, BookOpen, FileText, MessageSquare, Volume2 } from "lucide-react";
import CheckBox from '@mui/material/Checkbox';
import { useEffect, useState } from "react";
import { isCorrect, QuestionEnglishWordResponse } from "@/types/questionEnglishWordResponse";
import { MEnglishWord } from "@/types/server/englishWord";
import { useRef } from "react";
import { Confetti } from "../ui/confetti";
import confetti from "canvas-confetti";
import { EXSentenceRequest } from "@/types/exSentenceRequest";
import { EXSentenceResponse } from "@/types/exSentenceResponse";

export type WordsComponentProps = {
    user_id: string;
};
export default function WordsComponent({ user_id }: WordsComponentProps) {

    const [questions, setQuestions] = useState<QuestionEnglishWordResponse>();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isCorrectAns, setIsCorrectAns] = useState<boolean>(false);
    const [exSentence, setExSentence] = useState<EXSentenceResponse>();
    

    useEffect(() => {
        if (user_id === '') return;
        initializeCallAPI();
    }, [user_id]);

    // 初回実行用のAPIを叩く関数
    const initializeCallAPI = async () => {
        // 既存の問題がある場合：取得
        // ない場合：新規で問題を作成
        const response = await fetch("/api/questions/words")
        const data = await response.json() as QuestionEnglishWordResponse
        setQuestions(data);

        const body:EXSentenceRequest = {
            user_id: user_id,
            question_id: data.question_id,
            word_id: data.word_id
        }
        await fetch("/api/ex_sentence/words", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then(data => setExSentence(data))
    }

    // 選択肢を押下した際の処理
    const handleClick = (questions: QuestionEnglishWordResponse, q: MEnglishWord) => {
        if (!isCorrect(questions, q)) {
            alert("不正解...");
            setIsCorrectAns(false);
        }
        else {
            // alert("正解!!");
            showFireWorksConfetti();
            setIsCorrectAns(true);
        }
        setIsVisible(true);
    }

    // Nextボタン押下時の関数
    const nextHandleClick = () => {
        fetch("/api/questions/words")
            .then(res => res.json())
            .then(data => setQuestions(data));
        setIsVisible(false);
    }

    // Confetti関数
    const showFireWorksConfetti = () => {
        const duration = 2 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        }, 250)
    }

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
                            <div>No.{questions?.question_id}</div>
                            <div>{questions?.question_date}</div>
                        </div>
                    </div>

                    <div className="h-full flex flex-col justify-between">
                        <CardContent className="p-8 space-y-6">
                            <p className="text-xl text-muted-foreground">次の単語の意味を以下の選択肢から選んでください</p>
                            <div className="w-full flex items-center gap-3 flex justify-between">

                                <p className="text-2xl font-semibold">{
                                    // 英単語
                                    questions?.option.find(q => q.word_id === questions.word_id)?.english_word
                                }</p>
                                <div className="mt-auto pt-6 flex gap-3 items-center">
                                    <Volume2 size={22} className="cursor-pointer" />
                                    <CheckBox color='success' />
                                    {/* <Check className="text-green-500" /> */}
                                </div>
                            </div>

                            {/* 4択の表示 (英単語のみ)*/}

                            {/* グリッド */}
                            <div className="w-full flex justify-center">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl auto-rows-fr ">

                                    {questions?.option.map((q) => (
                                        <div
                                            key={q.word_id}
                                            className="bg-[#0f172a] rounded-2xl shadow-lg"
                                        >
                                            <button
                                                onClick={() => handleClick(questions, q)}
                                                className="w-full h-full p-10 flex items-center justify-center rounded-2xl hover:bg-slate-800 inline break-words whitespace-normal"
                                            >
                                                <p className="text-xl text-slate-300 text-center break-words ">
                                                    {q.meaning1}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {isVisible && isCorrectAns && (
                                <div className='space-y-6 py-8'>
                                    {/* AI Result */}
                                    <div className="border border-green-300 bg-green-50 rounded-xl p-4">
                                        <p className="font-semibold text-green-600">正解：
                                            {
                                                questions?.option
                                                    .find(q => q.word_id === questions.word_id)?.meaning1
                                            }</p>
                                        <p className="text-sm mt-1">{exSentence?.ex_sentence_en}</p>
                                        <p className="text-sm mt-1">{exSentence?.ex_sentence_ja}</p>
                                    </div>
                                </div>
                            )}

                            {isVisible && !isCorrectAns && (
                                <div className='space-y-6 py-8'>
                                    {/* AI Result */}
                                    <div className="border border-blue-300 bg-blue-50 rounded-xl p-4">
                                        <p className="font-semibold text-blue-600">
                                            【不正解】
                                            {
                                                questions?.option
                                                    .find(q => q.word_id === questions.word_id)?.meaning1
                                            }</p>
                                        <p className="text-sm mt-1">ここに例文が入る</p>
                                    </div>
                                </div>
                            )}

                        </CardContent>

                        <CardContent className="space-y-6">
                            <div className="mt-auto flex justify-between pt-6">
                                <Button variant="destructive">スキップ</Button>
                                <Button onClick={() => nextHandleClick()}>Next</Button>
                            </div>
                        </CardContent>
                    </div>
                </Card >
            </main >
        </>
    );
}