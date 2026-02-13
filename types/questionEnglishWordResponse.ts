import { DateTime } from "next-auth/providers/kakao";
import { MEnglishWord } from "./server/englishWord";
import { m } from "motion/react";

export type QuestionEnglishWordResponse = {
    user_id: string;
    question_id: number;
    word_id: number;
    question_date: DateTime;
    audio_file_path: string;
    option: MEnglishWord[];
}

/// 正誤判定する関数
export function isCorrect(qemr: QuestionEnglishWordResponse, m_english_word:MEnglishWord){
    return qemr.word_id === m_english_word.word_id;
}