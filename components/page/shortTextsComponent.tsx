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
import { FavoriteRequest } from "@/types/favoriteRequest";

export type ShortTextsComponentProps = {
    user_id: string;
};
export default function ShortTextsComponent({ user_id }: ShortTextsComponentProps) {

    const [contentHeight, setContentHeight] = useState<number>(70)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isCorrectAns, setIsCorrectAns] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
        sentence: "",
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

    // checkboxのhandle関数
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        favoriteFlagCallAPI(event.target.checked ? 1 : 0);
    };


    // DBに回答結果を登録
    const favoriteFlagCallAPI = async (favorite_flag: number) => {
        const request: FavoriteRequest = {
            user_id: user_id,
            question_id: questions.question_id,
            favorite_flag: favorite_flag,
            page_mode: PageMode.SHORT_TEXTS
        }

        await fetch("/api/favorite_flag", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
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
                            <div>No.{questions.question_id}</div>
                            <div>{questions.question_date}</div>
                        </div>
                    </CardTitle>

                    {/* <div className="flex flex-col justify-between h-full"> */}
                    <CardContent className="space-y-6">
                        <div className="flex items-center flex justify-between">
                            <p className="text-xl text-muted-foreground">次のお題を翻訳してください。</p>
                            <div className="mt-auto flex gap-3 items-center">
                                <Volume2 size={22} className="cursor-pointer" />
                                <CheckBox
                                    color='success'
                                    checked={checked}
                                    onChange={handleChange}
                                />
                                {/* <Check className="text-green-500" /> */}
                            </div>
                        </div>
                    </CardContent>
                    {/* <div className="flex flex-col h-full"> */}
                    <CardContent className="flex-1 h-full overflow-auto p-8 space-y-6 min-h-0">
                        <div className="w-full flex items-center gap-3 justify-between">
                            <div className="flex-1 border rounded-lg p-4">
                                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                    {questions.sentence}
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