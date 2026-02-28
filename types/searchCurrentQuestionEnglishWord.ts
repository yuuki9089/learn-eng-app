import { number } from "motion";
import { DateTime } from "next-auth/providers/kakao";
import { QuestionEnglishWordResponse } from "./englishWord/questionEnglishWordResponse";

export type searchCurrentQuestionEnglishWord = {
    user_id: string;
    question_id: number;
    word_id: number;
    question_date: DateTime;
    audio_file_path: string;
    option1: number;
    option2: number;
    option3: number;
    option4: number;
    scoring_result: number,
    favorite_flag : number,
    ex_sentence_en: string,
    ex_sentence_ja: string,
}