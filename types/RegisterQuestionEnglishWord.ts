import { DateTime } from "next-auth/providers/kakao";
import { MEnglishWord } from "./server/englishWord";

export type RegisterQuestionEnglishWord = {
    user_id: string;
    question_id: number;
    word_id: number;
    question_date: DateTime;
    audio_file_path: string;
    option: MEnglishWord[];
    ex_sentence_en: string;
    ex_sentence_ja: string;
}