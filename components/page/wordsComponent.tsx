"use client"

import { PageMode } from "@/types/pageMode";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Home, LogOut, Settings, BookOpen, FileText, MessageSquare, Volume2 } from "lucide-react";
import CheckBox from '@mui/material/Checkbox';
import { useEffect, useState } from "react";
import { isCorrect, QuestionEnglishWordResponse } from "@/types/englishWord/questionEnglishWordResponse";
import { MEnglishWord } from "@/types/db/englishWord";
import { useRef } from "react";
import { Confetti } from "../ui/confetti";
import confetti from "canvas-confetti";
import { EXSentenceRequest } from "@/types/englishWord/exSentenceRequest";
import { EXSentenceResponse } from "@/types/englishWord/exSentenceResponse";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RegisterAnsResultRequest } from "@/types/RegisterAnsResultRequest";
import { FavoriteRequest } from "@/types/favoriteRequest";
import { useRouter, useSearchParams } from "next/navigation";

export type WordsComponentProps = {
    user_id: string;
};
export default function WordsComponent({ user_id }: WordsComponentProps) {
    const router = useRouter()
    const searchParams = useSearchParams();
    const question_id: number = Number(searchParams.get("id") ?? "0");

    const [questions, setQuestions] = useState<QuestionEnglishWordResponse>({
        user_id: "",
        question_id: 0,
        word_id: 0,
        question_date: "",
        audio_file_path: "",
        option: [],
        favorite_flag: 0,
        scoring_result: 0,
        ex_sentence_en: "",
        ex_sentence_ja: ""
    });
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isCorrectAns, setIsCorrectAns] = useState<boolean>(false);
    const [exSentence, setExSentence] = useState<EXSentenceResponse>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (user_id === '') return;
        initializeCallAPI();
    }, [user_id]);

    // 初回実行用のAPIを叩く関数
    // 過去に解いた問題があるかを確認
    // ない：新規で作問
    // ある：過去の問題情報を取得
    const initializeCallAPI = async () => {
        const response = await fetch("/api/fetch/words?id=" + question_id)
        const data = await response.json() as QuestionEnglishWordResponse
        setQuestions(data);
        setChecked(data.favorite_flag === 1);

        // 過去問題の回答を見る場合
        if (data.scoring_result !== 0) {
            setIsSubmitting(false);
            setIsVisible(true);
        }
    }

    // 新規問題を作成するAPIを叩く関数
    const nextProblemCallAPI = async () => {
        console.log(`確認用：${questions.question_id + 1}`)

        router.push(`/words?id=${questions.question_id + 1}`)

        // 
        const res = await fetch(`/api/fetch/words?id=${questions.question_id + 1}`)
        const data = await res.json() as QuestionEnglishWordResponse
        setQuestions(data);

        // 新規問題をバックグラウンド実行
        const response = await fetch(`/api/questions/words?id=${questions.question_id + 1}`)
        // const data = await response.json() as QuestionEnglishWordResponse
        // setQuestions(data);
    }

    // 選択肢を押下した際の処理
    const handleClick = async (questions: QuestionEnglishWordResponse, q: MEnglishWord) => {
        let scoringResult: number = 0;
        if (!isCorrect(questions, q)) {
            alert("不正解...");
            setIsCorrectAns(false);
            scoringResult = 2; // 不正解
        }
        else {
            showFireWorksConfetti();
            setIsCorrectAns(true);
            scoringResult = 1; // 正解
        }
        setIsVisible(true);
        setIsSubmitting(true);

        registerAnsResultEnglishWord(questions, scoringResult)
    }

    // Nextボタン押下時の関数
    const nextHandleClick = () => {
        setIsVisible(false);
        setIsSubmitting(false);
        nextProblemCallAPI();
    }

    // スキップボタン押下時の関数
    const skipHandleClick = () => {
        const scoringResult = 3; // スキップ
        registerAnsResultEnglishWord(questions, scoringResult)
        nextProblemCallAPI(); // 次の問題へ
    }

    // DBに回答結果を登録
    const favoriteFlagCallAPI = async (favorite_flag: number) => {
        const request: FavoriteRequest = {
            user_id: user_id,
            question_id: questions.question_id,
            favorite_flag: favorite_flag,
            page_mode: PageMode.WORDS
        }

        await fetch("/api/favorite_flag", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
    }

    // DBに回答結果を登録
    const registerAnsResultEnglishWord = async (questions: QuestionEnglishWordResponse, scoringResult: number) => {

        const request: RegisterAnsResultRequest = {
            user_id: user_id,
            question_id: questions.question_id,
            scoring_result: scoringResult
        }

        await fetch("/api/question_ans/words", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
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

    // checkboxのhandle関数
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        favoriteFlagCallAPI(event.target.checked ? 1 : 0);
    };

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
                                    <CheckBox
                                        color='success'
                                        checked={checked}
                                        onChange={handleChange}
                                    />
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
                                                disabled={isSubmitting || questions.scoring_result !== 0}
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
                                <div className='space-y-6 pt-5  '>
                                    {/* AI Result */}
                                    <div className="border border-green-300 bg-green-50 rounded-xl p-4">

                                        <p className="font-semibold text-green-600">正解：
                                            {
                                                questions?.option
                                                    .find(q => q.word_id === questions.word_id)?.meaning1
                                            }</p>
                                        <Accordion
                                            elevation={0}
                                            sx={{
                                                backgroundColor: '#f0fdf4', // 背景色
                                                color: '"0000',              // 文字色（必要なら）
                                                boxShadow: 'none',
                                                '&:before': {
                                                    display: 'none', // 上の仕切り線を消す
                                                }
                                            }
                                            } >
                                            <AccordionSummary
                                                expandIcon={<ArrowDropDownIcon />}>
                                                <p className="text-lm mt-1">{questions.ex_sentence_en}</p>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <p className="text-lm mt-1">{questions.ex_sentence_ja}</p>
                                            </AccordionDetails>
                                        </Accordion>
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
                                        <Accordion
                                            elevation={0}
                                            sx={{
                                                backgroundColor: '#eff6ff', // 背景色
                                                color: '"0000',              // 文字色（必要なら）
                                                boxShadow: 'none',
                                                '&:before': {
                                                    display: 'none', // 上の仕切り線を消す
                                                }
                                            }
                                            } >
                                            <AccordionSummary
                                                expandIcon={<ArrowDropDownIcon />}>
                                                <p className="text-lm mt-1">{questions.ex_sentence_en}</p>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <p className="text-lm mt-1">{questions.ex_sentence_ja}</p>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                </div>
                            )}

                        </CardContent>

                        <CardContent className="space-y-6">
                            <div className="mt-auto flex justify-between">
                                {/* <a href={`/words?id=${questions.question_id + 1}`}> */}
                                <Button variant="destructive"
                                    onClick={() => skipHandleClick()}
                                    disabled={isSubmitting || questions.scoring_result !== 0}
                                >スキップ</Button>
                                {/* </a> */}

                                {/* <a href={`/words?id=${questions.question_id + 1}`}> */}
                                <Button
                                    onClick={() => nextHandleClick()}
                                    disabled={!isSubmitting}
                                >Next</Button>
                                {/* </a> */}
                            </div>
                        </CardContent>
                    </div>
                </Card >
            </main >
        </>
    );
}