import { QuestionEnglishWordResponse } from "@/types/questionEnglishWordResponse";
import { GetEnglishWord, GetMaxQuestionID, RegesterEXSentenceEnglishWord } from "./db_controls";
import { InsertQuestionEnglishWord } from "./db_controls";
import { number } from "motion";
import { MEnglishWord } from "@/types/server/englishWord";
import { EXSentenceRequest } from "@/types/exSentenceRequest";
import { generateInferenceWithOllama } from "./ollama_ai";
import { Chonburi } from "next/font/google";
import { EXSentenceResponse } from "@/types/exSentenceResponse";
import { OllamaApiPayload } from "@/types/ai/ollama_api_payload";
import { OllamaApiResponse } from "@/types/ai/ollama_api_response";
import { ExSentence } from "@/types/ai/ex_sentence";

/**
 * 英単語の4択を作問する関数
 * @param user_id 
 */
export async function CreateEnglsihWordQuestion(user_id: string): Promise<QuestionEnglishWordResponse> {
    // 英単語マスタの単語情報を取得
    const english_words: MEnglishWord[] = await GetEnglishWord();

    // m_english_wordsの数を取得
    const wordCount = english_words.length;

    // question_idのmax値を取得
    const current_question_max_id: number = await GetMaxQuestionID(user_id);

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

    // 出題日を作成
    const genQuestionDate = new Date().toLocaleDateString("ja-JP", {
        year: "numeric", month: "2-digit",
        day: "2-digit"
    })

    // 戻り値はフロントに返すJSON
    const response: QuestionEnglishWordResponse = {
        user_id: user_id,
        question_id: current_question_max_id + 1,
        word_id: correctWord.word_id,
        question_date: genQuestionDate,
        audio_file_path: "",
        option: arr
    }

    //DB(英単語出題テーブル)に登録
    InsertQuestionEnglishWord(response)

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
    const english_all_words = await GetEnglishWord();
    // word_idが一致した単語をMEnglishWord型で返却
    // 1件もヒットしなかった場合はnull
    const english_word: MEnglishWord | null = english_all_words.find((word) =>
        word.word_id === data.word_id
    ) ?? null

    // Ollamaに渡すためのmessagesを作成
    const chat_messages: OllamaApiPayload[] = [];
    chat_messages.push({
        "role": "system",
        "content": "あなたは優秀な英語教師です。以下の単語を使用して例文を1文作成してください。\n"
            + "「" + english_word?.english_word + "」\n"
            + "ただし、回答は以下の条件に従って **JSON オブジェクトだけ** を返してください。"
            + "- 返答は必ず `{\n  \"ex_sentence_en\": \"...\",\n  \"ex_sentence_ja\": ...\n}` の形で出力し、"
            + " `ex_sentence_en` は文字列で「英語の例文」を1文で表します。"
            + "- `ex_sentence_ja` は 文字列で、「ex_sentence_enで生成した例文の日本語訳」を示します。"
            + "- 上記以外のテキストは一切出力しないでください。"
            + "- JSON が不正になるような文字列は絶対に避けてください"
    }
    );

    // Ollamaに例文(ja/en)を生成させる
    const result: OllamaApiResponse = await generateInferenceWithOllama(chat_messages)

    // 戻り値
    const ex_sentence_obj: ExSentence = JSON.parse(result.message.content)

    // 戻り値用にJSONを生成
    const response: EXSentenceResponse = {
        user_id: data.user_id,
        question_id: data.question_id,
        word_id: data.word_id,
        ex_sentence_en: ex_sentence_obj.ex_sentence_en,
        ex_sentence_ja: ex_sentence_obj.ex_sentence_ja
    }

    // DBに登録
    RegesterEXSentenceEnglishWord(response)

    // フロントへ返す
    return response;
}
