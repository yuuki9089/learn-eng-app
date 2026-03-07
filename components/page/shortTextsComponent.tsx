"use client"

import { PageMode } from "@/types/pageMode";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Home, LogOut, Settings, BookOpen, FileText, MessageSquare, Volume2 } from "lucide-react";
import CheckBox from '@mui/material/Checkbox';
import { CardHeader } from "@mui/material";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuestionShortTextsResponse } from "@/types/short-texts/questionsShortTexts.Response";

export type ShortTextsComponentProps = {
    user_id: string;
};
export default function ShortTextsComponent({ user_id }: ShortTextsComponentProps) {

    const [contentHeight, setContentHeight] = useState<number>(70)
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // /api/short-texts ← id=0
    // /api/short-texts?id=・・ ← id=・・
    const router = useRouter()
    const searchParams = useSearchParams();
    const question_id: number = Number(searchParams.get("id") ?? "0");
    const [questions, setQuestions] = useState<QuestionShortTextsResponse>({
        user_id: "",
        question_id: 0,
        word_id1: 0,
        word_id2: 0,
        word_id3: 0,
        word_id4: 0,
        word_id5: 0,
        word_id6: 0,
        word_id7: 0,
        word_id8: 0,
        word_id9: 0,
        word_id10: 0,
        question_date: "",
        audio_file_path: "",
        scoring_result: 0,
        answer_accuracy_rate: 0,
        advice: "",
        favorite_flag: 0,
        summarization: "",
        example_answer: ""
    })
    const [checked, setChecked] = useState(false);

    // 画面リロード時に動く関数
    useEffect(() => {
        if (user_id === '') return;
        initializeCallAPI();
    }, [user_id]);


    const initializeCallAPI = async () => {
        const response = await fetch("/api/fetch/short-texts?id=" + question_id)
        const data = await response.json() as QuestionShortTextsResponse
        setQuestions(data);
        setChecked(data.favorite_flag === 1);
    }

    // shadcnuiのtextareaがうまく行かないので↓から拝借
    // https://zenn.dev/mitate_gengaku/articles/react-dynamic-height-textarea
    const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (textareaRef.current) {
            setContentHeight(textareaRef.current.scrollHeight)
        }

        if (!value.length) {
            setContentHeight(40)
        }
    }

    return (
        <>
            {/* Main */}
            <main className="flex-1 flex gap-6 p-8 h-screen">
                {/* Center content */}
                <Card className="flex flex-col h-full">
                    <CardTitle className="flex justify-between items-start px-5">
                        <div>
                            <h2 className="text-3xl font-bold">英短文</h2>
                        </div>
                        <div className="text-right text-xl text-muted-foreground">
                            <div>No.100</div>
                            <div>2025/11/3</div>
                        </div>
                    </CardTitle>

                    {/* <div className="flex flex-col justify-between h-full"> */}
                    <CardContent className="space-y-6">
                        <div className="flex items-center flex justify-between">
                            <p className="text-xl text-muted-foreground">次のお題を翻訳してください。</p>
                            <div className="mt-auto flex gap-3 items-center">
                                <Volume2 size={22} className="cursor-pointer" />
                                <CheckBox color='success' />
                                {/* <Check className="text-green-500" /> */}
                            </div>
                        </div>
                    </CardContent>
                    {/* <div className="flex flex-col h-full"> */}
                    <CardContent className="flex-1 h-full overflow-auto p-8 space-y-6 min-h-0">
                        <div className="w-full flex items-center gap-3 justify-between">
                            <div className="flex-1 border rounded-lg p-4">
                                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                    Learning English requires consistent effort and daily practice.
                                    Many learners struggle not because the language is too difficult,
                                    but because they do not spend enough time using it in real situations.
                                    One effective method is to read short passages every day and try
                                    to translate them into your native language. This helps you build
                                    vocabulary, understand grammar patterns, and improve comprehension.

                                    Another useful habit is speaking out loud while studying.
                                    When you read a sentence, try repeating it several times
                                    until it feels natural. This allows your brain to connect
                                    the written form of the language with its spoken sound.
                                    Over time, you will notice that sentences become easier
                                    to understand and produce.

                                    It is also important to review what you have learned.
                                    Even if you study many new words, you may forget them
                                    quickly unless you revisit them regularly. Creating
                                    small quizzes for yourself or using flashcards can help
                                    strengthen your memory.

                                    Finally, remember that mistakes are a natural part
                                    of learning. Do not be afraid to make them. Each mistake
                                    is an opportunity to improve your understanding and
                                    become more confident in English.
                                </p>
                            </div>
                        </div>
                        <Textarea
                            // ref={textareaRef}
                            // onInput={handleInput}
                            placeholder="ここに回答を入力"
                            className="resize-none overflow-auto"
                            onChange={onChangeContent}
                            ref={textareaRef}
                            style={{
                                height: contentHeight
                            }}

                        />

                        <Button className="mx-auto block">採点</Button>
                        <div className='space-y-6'>
                            {/* AI Result */}
                            <div className="border border-green-300 bg-green-50 rounded-xl p-4">
                                <p className="font-semibold text-green-600">AI採点結果：80%</p>
                                <p className="text-sm mt-1">ここにアドバイスが入る</p>
                            </div>

                            {/* Model Answer */}
                            < div className="border border-blue-300 bg-blue-50 rounded-xl p-4">
                                <p className="font-semibold text-blue-600">模範解答</p>
                                <p className="text-sm mt-1">ここに模範解答が入る</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-auto space-y-2 flex justify-between">

                        <Button variant="destructive">スキップ</Button>
                        <Button>Next</Button>
                    </CardFooter>
                    {/* </div> */}
                    {/* </div> */}
                </Card >
            </main >
        </>
    )
}