import { DateTime } from "next-auth/providers/kakao";
import { MEnglishWord } from "../db/englishWord";
import { m } from "motion/react";

export type QuestionEnglishWordResponse = {
    user_id: string;
    question_id: number;
    word_id: number;
    question_date: DateTime;
    audio_file_path: string;
    option: MEnglishWord[];
    favorite_flag : number;
    scoring_result:number
    ex_sentence_en: string,
    ex_sentence_ja: string,
}

/// 正誤判定する関数
export function isCorrect(qemr: QuestionEnglishWordResponse, m_english_word:MEnglishWord){
    return qemr.word_id === m_english_word.word_id;
}