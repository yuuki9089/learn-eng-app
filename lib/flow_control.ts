import { QuestionEnglishWordResponse } from "@/types/englishWord/questionEnglishWordResponse";
import { GetCurrentQuestionEnglishWord, GetEnglishWord, GetMaxQuestionID, GetTQuestionEnglishWord, GetTQuestionSentence, GetUNAnswerdQuestionID, } from "./db_controls";
import { InsertQuestionEnglishWord } from "./db_controls";
import { number } from "motion";
import { MEnglishWord } from "@/types/db/englishWord";
import { EXSentenceRequest } from "@/types/englishWord/exSentenceRequest";
import { generateInferenceWithOllama } from "./ollama_ai";
import { Chonburi } from "next/font/google";
import { EXSentenceResponse } from "@/types/englishWord/exSentenceResponse";
import { OllamaApiPayload } from "@/types/ai/ollama_api_payload";
import { OllamaApiResponse } from "@/types/ai/ollama_api_response";
import { ExSentence } from "@/types/ai/ex_sentence";
import { searchCurrentQuestionEnglishWord } from "@/types/searchCurrentQuestionEnglishWord";
import { DateTime } from "next-auth/providers/kakao";
import { historyRequest } from "@/types/historyRequest";
import { PageMode } from "@/types/pageMode";
import { t_question_english_word } from "@/types/db/t_question_english_word";
import { historyResponse } from "@/types/historyResponse";
import { t_question_sentence } from "@/types/db/t_question_sentence";

/**
 * 英単語の4択を作問する関数
 * @param user_id 
 */
export async function CreateEnglishWordQuestion(user_id: string): Promise<QuestionEnglishWordResponse> {
    // 英単語マスタの単語情報を取得
    const english_words: MEnglishWord[] = await GetEnglishWord();

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


    const sentenceReq: EXSentenceRequest = {
        user_id: user_id,
        // question_id: current_question_max_id + 1,
        word_id: correctWord.word_id
    }
    // 例文の登録
    const sentenceRes = await GenEXSentence(sentenceReq);

    // question_idのmax値を取得
    const current_question_max_id: number = await GetMaxQuestionID(user_id);

    // 戻り値はフロントに返すJSON
    const response: QuestionEnglishWordResponse = {
        user_id: user_id,
        question_id: current_question_max_id + 1,
        word_id: correctWord.word_id,
        question_date: ProcessQuestionDate(new Date()),
        audio_file_path: "",
        option: arr,
        scoring_result: 0,
        favorite_flag: 0,
        ex_sentence_en: sentenceRes.ex_sentence_en,
        ex_sentence_ja: sentenceRes.ex_sentence_ja
    }

    //DB(英単語出題テーブル)に登録
    await InsertQuestionEnglishWord(response)

    return response;
}

/**
    過去解いた問題があるか
    No：新規作成
    Yes：question_idが0またはmaxを超えている
        Yes：最大問題番号を返す
        No：指定されたquestion_idを返す
 * @param user_id 
 * @returns 
 */
export async function FetchQuestionEnglishWord(user_id: string, question_id: number): Promise<QuestionEnglishWordResponse> {
    // 英単語マスタの単語情報を取得
    const english_words: MEnglishWord[] = await GetEnglishWord();

    // m_english_wordsの数を取得
    const wordCount = english_words.length;

    // question_idのmax値を取得
    let current_question_max_id: number = await GetMaxQuestionID(user_id);

    // 過去の問題がある
    if (current_question_max_id != null) {


        if (question_id !== 0 && question_id <= current_question_max_id)
            current_question_max_id = question_id;

        // /api/wordsのとき(クエリ指定がないとき)
        // /api/words?<範囲外指定>のとき
        if (question_id === 0 || current_question_max_id < question_id) {
            let unanswerd_question_id = await GetUNAnswerdQuestionID(user_id);
            console.log(`unanswerd_question_id:${unanswerd_question_id}`);
            current_question_max_id = unanswerd_question_id;
        }

        // t_question_max_idを基にレスポンスに必要な情報をDBから取得
        const maxQuestionInfo: searchCurrentQuestionEnglishWord = await GetCurrentQuestionEnglishWord(user_id, current_question_max_id)

        // optionのword_idを基にMEglishWordを取得
        const options: MEnglishWord[] = [];
        options.push(GetMEnglshWordInfo(english_words, maxQuestionInfo.option1));
        options.push(GetMEnglshWordInfo(english_words, maxQuestionInfo.option2));
        options.push(GetMEnglshWordInfo(english_words, maxQuestionInfo.option3));
        options.push(GetMEnglshWordInfo(english_words, maxQuestionInfo.option4));


        // response用にJSONにマッピング
        const response: QuestionEnglishWordResponse = {
            user_id: maxQuestionInfo.user_id,
            question_id: maxQuestionInfo.question_id,
            word_id: maxQuestionInfo.word_id,
            question_date: ProcessQuestionDate(new Date(maxQuestionInfo.question_date)),
            audio_file_path: maxQuestionInfo.audio_file_path,
            option: options,
            favorite_flag: maxQuestionInfo.favorite_flag,
            scoring_result: maxQuestionInfo.scoring_result,
            ex_sentence_en: maxQuestionInfo.ex_sentence_en,
            ex_sentence_ja: maxQuestionInfo.ex_sentence_ja
        }
        return response;
    }

    const cewq: QuestionEnglishWordResponse[] = []
    // 初回実行のみ10問作成
    for (let i = 0; i < 10; i++) {
        cewq.push(await CreateEnglishWordQuestion(user_id));
        // console.log(`通った${i}回目`);
    }

    // cewq.map((m) => {console.log(m.question_id)})

    // 1つ目のみ返却
    return cewq[0];
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
export async function GenEXSentence(data: EXSentenceRequest): Promise<EXSentenceResponse> {
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
        // question_id: data.question_id,
        word_id: data.word_id,
        ex_sentence_en: ex_sentence_obj.ex_sentence_en,
        ex_sentence_ja: ex_sentence_obj.ex_sentence_ja
    }

    // // DBに登録
    // RegesterEXSentenceEnglishWord(response)

    // フロントへ返す
    return response;
}

function GetMEnglshWordInfo(english_words: MEnglishWord[], word_id: number): MEnglishWord {
    // 英単語マスタ情報からword_idが一致している単語を取得
    return english_words.filter((w) => w.word_id === word_id)[0]
}

function ProcessQuestionDate(date: Date) {
    return date.toLocaleDateString("ja-JP", {
        year: "numeric", month: "2-digit",
        day: "2-digit"
    })
}

/**
 * 
 */
export async function GetQuestionHistory(request: historyRequest): Promise<historyResponse[]> {
    console.log("GetQuestionHistory")
    let response: historyResponse[] = []

    // word_idから英単語を取得
    const english_all_words = await GetEnglishWord();

    // PageModeを基に取得するテーブルでswitch/case
    switch (request.page_mode) {
        // t_question_english_word
        case PageMode.WORDS:
            let english_words_history: t_question_english_word[] = await GetTQuestionEnglishWord(request.user_id);

            response = english_words_history.map((item) => ({
                user_id: item.user_id,
                question_id: item.question_id,
                english_word: GetMEnglshWordInfo(english_all_words, item.word_id).english_word,
                question_date: item.question_date,
                summarization: "",
                favorite_flag: item.favorite_flag,
                result: item.scoring_result,
            }));
            break;
        // console.log(english_words_history);

        // t_question_phrase
        // case PageMode.PHRASES:
        //     targetTable = "t_question_phrase";
        //     break;

        // t_question_sentence
        case PageMode.SHORT_TEXTS:
            let short_texts_history: t_question_sentence[] = await GetTQuestionSentence(request.user_id);

            response = short_texts_history.map((item) => ({
                user_id: item.user_id,
                question_id: item.question_id,
                english_word: GetMEnglshWordInfo(english_all_words, item.word_id1).english_word,
                question_date: item.question_date,
                summarization: item.summarization,
                favorite_flag: item.favorite_flag,
                result: item.scoring_result,
            }));
            break;
    }
    return response;
}

function GGetTQuestionSentence(user_id: string): t_question_sentence[] | PromiseLike<t_question_sentence[]> {
    throw new Error("Function not implemented.");
}
