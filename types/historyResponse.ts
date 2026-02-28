import { DateTime } from "next-auth/providers/kakao";

export type historyResponse = {
    user_id: string;
    question_id: number;
    english_word: string;
    question_date: DateTime;
    summarization: string;
    favorite_flag : number;
    result:number;
}