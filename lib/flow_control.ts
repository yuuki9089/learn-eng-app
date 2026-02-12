import { QuestionEnglishWordResponse } from "@/types/questionEnglishWordResponse";
import { GetEnglishWord } from "./db_controls";
import { number } from "motion";
import { MEnglishWord } from "@/types/server/englishWord";
import { EXSentenceRequest } from "@/types/exSentenceRequest";
import { generateInferenceWithOllama } from "./ollama_ai";
import { Chonburi } from "next/font/google";
import { EXSentenceResponse } from "@/types/exSentenceResponse";

/**
 * 英単語の4択を作問する関数
 * @param user_id 
 */
export async function CreateEnglsihWordQuestion(user_id: string): Promise<QuestionEnglishWordResponse> {
    const english_words = await GetEnglishWord();
    // console.log(english_words);
    // console.log(english_words[0]);
    // m_english_wordsの数を取得
    const wordCount = english_words.length;
    // 1から英単語数で4個重複無しで乱数を弾く
    const set = new Set(); // 一意の数字しか許容しない
    while (set.size < 4) {
        const n = english_words[Math.floor(Math.random() * english_words.length)];
        set.add(n);
    }

    // 抽出した4つの選択肢から1つ乱数を弾いて問題とする
    const index: number = Math.floor(Math.random() * set.size) // 0～3
    const arr: MEnglishWord[] = Array.from(set) as MEnglishWord[]
    const correctWord: MEnglishWord = arr[index]
    // console.log(correctWord);

    // const question_num:number = Array.from(set)[Math.floor(Math.random() * set.size)].word_id
    const genQuestionDate = new Date().toLocaleDateString("ja-JP", {
        year: "numeric", month: "2-digit",
        day: "2-digit"
    })

    // 戻り値はフロントに返すJSON
    const response: QuestionEnglishWordResponse = {
        user_id: user_id,
        question_id: 1,
        word_id: correctWord.word_id,
        question_date: genQuestionDate,
        audio_file_path: "",
        option: arr
    }
    return response;
}

// 渡された配列の要素の順番をシャッフルします．
function arrayShuffle(array: QuestionEnglishWordResponse[]) {
    for (let i = array.length - 1; 0 < i; i--) {
        // 0〜(i+1)の範囲で値を取得
        let r = Math.floor(Math.random() * (i + 1));

        // 要素の並び替えを実行
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array;
}

/**
 * 例文の日本語と英語を作成して
 * フロントとDBに登録する関数
 */
export async function GenEXSentence(data: EXSentenceRequest) {
    // word_idから英単語を取得
    const english_words = await GetEnglishWord();
    english_words.filter((word) => {
        word.word_id === data.word_id
    })
    const result = await generateInferenceWithOllama()
    console.log("responseテスト" + result);
    const response:EXSentenceResponse={
        user_id: data.user_id,
        question_id: data.question_id,
        word_id: data.word_id,
        ex_sentence_en: "英語は未実装",
        ex_sentence_ja: result.message.content
    }
    return response;
    // AIに例文の作成を投げる(日本語)
    // return generateInferenceWithOllama();

    // AIに例文の作成を投げる(英語)
    // DBに登録
    // フロントへ返す
}
