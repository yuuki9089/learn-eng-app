import { NextResponse, userAgent } from "next/server";
import { pool } from "@/lib/db";
import { MEnglishWord } from "@/types/db/englishWord";
import { QuestionEnglishWordResponse } from "@/types/englishWord/questionEnglishWordResponse";
import { type } from "os";
import { EXSentenceResponse } from "@/types/englishWord/exSentenceResponse";
import { RegisterAnsResultRequest } from "@/types/RegisterAnsResultRequest";
import { searchCurrentQuestionEnglishWord } from "@/types/searchCurrentQuestionEnglishWord";
import { FavoriteRequest } from "@/types/favoriteRequest";
import { t_question_english_word } from "@/types/db/t_question_english_word";
import { number } from "motion";
import { t_question_sentence } from "@/types/db/t_question_sentence";
import { QuestionShortTextsResponse } from "@/types/short-texts/questionsShortTexts.Response";
import { OllamaApiPayload } from "@/types/ai/ollama_api_payload";
import { OllamaApiResponse } from "@/types/ai/ollama_api_response";
import { generateInferenceWithOllama } from "./ollama_ai";
import { ScoringQuestionSentence } from "@/types/ai/scoring_question_sentence";
import { ScoringEnglishSentenceResponse } from "@/types/short-texts/scoringEnglishSentenceResponse";

/**
 * 英単語マスタを取得
 * @returns 
 */
export async function GetEnglishWord(): Promise<MEnglishWord[]> {
  try {
    // [rows]でQueryResultだけを取得
    const [rows] = await pool.query(
      "SELECT word_id, english_word, pos, meaning1, meaning2, meaning3 " +
      "FROM m_english_word " +
      "ORDER BY word_id"
    );
    return rows as MEnglishWord[];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/***
 * t_question_english_wordの一覧を取得する関数
 */
export async function GetTQuestionEnglishWord(user_id: string): Promise<t_question_english_word[]> {
  try {
    // [rows]でQueryResultだけを取得
    const [rows] = await pool.query(
      `(SELECT
      user_id,
      question_id,
      word_id,
      question_date,
      audio_file_path,
      option1,
      option2,
      option3,
      option4,
      scoring_result,
      favorite_flag = 1 as favorite_flag,
      ex_sentence_en,
      ex_sentence_ja
    FROM
      t_question_english_word
    WHERE
      user_id = ? AND scoring_result <> 0
    ORDER BY
      question_id)
    UNION 
    (SELECT
      user_id,
      question_id,
      word_id,
      question_date,
      audio_file_path,
      option1,
      option2,
      option3,
      option4,
      scoring_result,
      favorite_flag = 1 as favorite_flag,
      ex_sentence_en,
      ex_sentence_ja
    FROM
      t_question_english_word
    WHERE
      user_id = ? AND scoring_result = 0
    ORDER BY
      question_id
      LIMIT 1)`,
      [
        user_id,
        user_id
      ]
    );
    return rows as t_question_english_word[];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function GetTQuestionSentence(user_id: string): Promise<t_question_sentence[]> {
  try {
    // [rows]でQueryResultだけを取得
    const [rows] = await pool.query(
      `(SELECT
      *
    FROM
      t_question_sentence
    WHERE
      user_id = ? AND scoring_result <> 0
    ORDER BY
      question_id)
    UNION 
    (SELECT
      *
    FROM
      t_question_sentence
    WHERE
      user_id = ? AND scoring_result = 0
    ORDER BY
      question_id
      LIMIT 1)`,
      [
        user_id,
        user_id
      ]
    );
    return rows as t_question_sentence[];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * user_idを基に登録してあるquestion_idの最大値を取得する関数
 * @param user_id 
 * @returns 
 */
export async function GetMaxQuestionID(user_id: string): Promise<number> {
  try {
    const [rows] = await pool.query(
      `SELECT MAX(tqew.question_id) AS max_question_id 
      FROM t_question_english_word tqew 
      WHERE tqew.user_id = ?`,
      [
        user_id
      ]
    );

    const a = rows as { max_question_id: number }[]
    return a[0].max_question_id;

  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * t_question_sentenceから最大のquestion_idを取得する関数
 * @param params 
 */
export async function GetMaxQuestionIDSentence(user_id: string) {
  try {
    const [rows] = await pool.query(
      `SELECT MAX(tqs.question_id) AS max_question_id
	     FROM t_question_sentence tqs 
	     WHERE tqs.user_id = ?;
      `,
      [
        user_id
      ]
    );
    const a = rows as { max_question_id: number }[]
    return a[0].max_question_id;
  }
  catch (ex) {
    console.log(ex);
    throw ex;
  }
}

export async function GetUNAnswerdQuestionID(user_id: string): Promise<number> {
  try {
    const [rows] = await pool.query(
      `SELECT question_id FROM t_question_english_word tqew 
      WHERE tqew.user_id = ? AND tqew.scoring_result = 0
      ORDER BY question_id 
      LIMIT 1`,
      [
        user_id
      ]
    );

    const a = rows as { question_id: number }[]
    return a[0].question_id;

  } catch (err) {
    console.error(err);
    throw err;
  }
}


export async function GetUNAnswerdQuestionIDSentence(user_id: string): Promise<number> {
  try {
    const [rows] = await pool.query(
      `SELECT question_id FROM t_question_sentence tqs 
       WHERE tqs.user_id = ? AND tqs.scoring_result = 0
       ORDER BY question_id 
       LIMIT 1`,
      [
        user_id
      ]
    );

    const a = rows as { question_id: number }[]
    return a[0].question_id;

  } catch (err) {
    console.error(err);
    throw err;
  }
}


/**
 * 英単語出題テーブルに登録
 * @param request 
 * @returns 
 */
export async function InsertQuestionEnglishWord(request: QuestionEnglishWordResponse) {
  try {
    const [result]: any = await pool.execute(
      `INSERT INTO t_question_english_word (
        user_id,
        question_id,
        word_id,
        question_date,
        audio_file_path,
        option1,
        option2,
        option3,
        option4,
        scoring_result,
        favorite_flag,
        ex_sentence_en,
        ex_sentence_ja
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request.user_id,
        request.question_id,
        request.word_id,
        request.question_date,
        request.audio_file_path,
        request.option[0].word_id,
        request.option[1].word_id,
        request.option[2].word_id,
        request.option[3].word_id,
        request.scoring_result,
        request.favorite_flag,
        request.ex_sentence_en,
        request.ex_sentence_ja
      ]
    );
    console.log("DB_inserted:InsertQuestionEnglishWord");
    return NextResponse.json({
      success: true,
    });
  }
  catch (error) {
    console.error("INSERT ERROR:", error);
    return NextResponse.json(
      { error: "DB Insert Failed:InsertQuestionEnglishWord" },
      { status: 500 }
    );
  }
}

export async function DBInsertQuestionSentence(qstr: QuestionShortTextsResponse) {
  try {
    const [result]: any = await pool.execute(
      `INSERT INTO t_question_sentence (
        user_id,
        question_id,
        word_id1,
        word_id2,
        word_id3,
        word_id4,
        word_id5,
        word_id6,
        word_id7,
        word_id8,
        word_id9,
        word_id10,
        question_date,
        audio_file_path,
        scoring_result,
        answer_accuracy_rate,
        advice,
        favorite_flag,
        summarization,
        sentence,
        example_answer
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)`,
      [
        qstr.user_id,
        qstr.question_id,
        qstr.word_id1,
        qstr.word_id2,
        qstr.word_id3,
        qstr.word_id4,
        qstr.word_id5,
        qstr.word_id6,
        qstr.word_id7,
        qstr.word_id8,
        qstr.word_id9,
        qstr.word_id10,
        qstr.question_date,
        qstr.audio_file_path,
        qstr.scoring_result,
        qstr.answer_accuracy_rate,
        qstr.advice,
        qstr.favorite_flag,
        qstr.summarization,
        qstr.sentence,
        qstr.example_answer
      ]
    );

    console.log("DB_inserted:DBInsertQuestionSentence");
    return NextResponse.json({
      success: true,
    });

  }
  catch (error) {
    console.error("INSERT ERROR:", error);
    return NextResponse.json(
      { error: "DB Insert Failed:DBInsertQuestionSentence" },
      { status: 500 }
    );
  }
}

/**
 * 例文をDBに登録(更新)
 * @param request 
 * @returns 
 */
// export async function RegesterEXSentenceEnglishWord(request: EXSentenceResponse) {
//   try {
//     const [result]: any = await pool.execute(
//       `UPDATE t_question_english_word tqew
//       SET tqew.ex_sentence_en = ?, tqew.ex_sentence_ja = ?
//       WHERE tqew.user_id = ? AND tqew.question_id = ?`,
//       [
//         request.ex_sentence_en,
//         request.ex_sentence_ja,
//         request.user_id,
//         request.question_id
//       ]
//     );
//     console.log("DB_inserted");
//     return NextResponse.json({
//       success: true,
//     });
//   }
//   catch (error) {
//     console.error("INSERT ERROR:", error);
//     return NextResponse.json(
//       { error: "DB Insert Failed" },
//       { status: 500 }
//     );
//   }
// }

/**
 * DBに英単語の回答結果を登録する関数
 * @param request 
 * @returns 
 */
export async function RegesterAnsResultEnglishWord(request: RegisterAnsResultRequest) {
  try {
    const [result]: any = await pool.execute(
      `UPDATE t_question_english_word tqew
      SET tqew.scoring_result = ?
      WHERE tqew.user_id = ? AND tqew.question_id = ?`,
      [
        request.scoring_result,
        request.user_id,
        request.question_id
      ]
    );
    console.log("DB_inserted:RegesterAnsResultEnglishWord");
    return NextResponse.json({
      success: true,
    });
  }
  catch (error) {
    console.error("INSERT ERROR:", error);
    return NextResponse.json(
      { error: "DB Insert Failed:RegesterAnsResultEnglishWord" },
      { status: 500 }
    );
  }
}

export async function RegesterAnsResultShortTexts(request: RegisterAnsResultRequest): Promise<ScoringEnglishSentenceResponse> {
  try {
    // user_idとquestion_idを基に問題文を取得
    const cuurentQuestionSentence: QuestionShortTextsResponse = await GetSentenceFromQuesitonID(request.user_id, request.question_id);
    const currentSentence = cuurentQuestionSentence.sentence;

    // 問題文と回答内容をセットでAIに採点をぶん投げる
    const scoringResult: ScoringQuestionSentence = await ScoringSentence(currentSentence, request.user_ans);
    console.log(`user_ans:${request.user_ans}`);
    console.log(`correct_ans_rate:${scoringResult.correct_ans_rate}`);
    console.log(`example_answer:${scoringResult.example_answer}`);
    console.log(`advice:${scoringResult.advice}`);
    // 戻ってきた採点結果を基にscoring_resultを1or2でセット
    if (Number(scoringResult.correct_ans_rate) > 80) request.scoring_result = 1;
    else request.scoring_result = 2;

    // 回答結果を登録
    const [result]: any = await pool.execute(
      `UPDATE t_question_sentence tqs
      SET tqs.scoring_result = ?, tqs.user_ans = ?, tqs.answer_accuracy_rate = ?, tqs.example_answer = ?, tqs.advice = ? 
      WHERE tqs.user_id = ? AND tqs.question_id = ?`,
      [
        request.scoring_result,
        request.user_ans,
        scoringResult.correct_ans_rate,
        scoringResult.example_answer,
        scoringResult.advice,
        request.user_id,
        request.question_id
      ]
    );
    console.log("DB_inserted:RegesterAnsResultShortTexts");

    const response: ScoringEnglishSentenceResponse = {
      user_id: request.user_id,
      question_id: request.question_id,
      scoring_result: request.scoring_result,
      user_ans: request.user_ans,
      correct_ans_rate: Number(scoringResult.correct_ans_rate),
      example_answer: scoringResult.example_answer,
      advice: scoringResult.advice
    }

    return response;
    // return NextResponse.json({
    //   success: true,
    // });
  }
  catch (error) {
    console.error("INSERT ERROR:", error);
    throw new Error("DB Insert Failed:RegesterAnsResultShortTexts");
  }
}

export async function GetCurrentQuestionEnglishWord(user_id: string, question_id: number): Promise<searchCurrentQuestionEnglishWord> {
  try {
    const [rows] = await pool.query(
      `SELECT
        user_id,
        question_id,
        word_id,
        question_date,
        audio_file_path,
        option1,
        option2,
        option3,
        option4,
        scoring_result,
        favorite_flag,
        ex_sentence_en,
        ex_sentence_ja 
        FROM t_question_english_word tqew 
        WHERE tqew.user_id = ? AND tqew.question_id = ?`
      ,
      [
        user_id,
        question_id,
      ]
    );
    const a = rows as searchCurrentQuestionEnglishWord[];
    return a[0];

  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function GetSentenceFromQuesitonID(user_id: string, question_id: number): Promise<QuestionShortTextsResponse> {
  try {
    const [rows] = await pool.query(
      `SELECT
        user_id,
        question_id,
        word_id1,
        word_id2,
        word_id3,
        word_id4,
        word_id5,
        word_id6,
        word_id7,
        word_id8,
        word_id9,
        word_id10,
        question_date,
        audio_file_path,
        scoring_result,
        answer_accuracy_rate,
        advice,
        favorite_flag,
        sentence,
        summarization,
        example_answer,
        user_ans 
        FROM t_question_sentence tqs 
        WHERE tqs.user_id = ? AND tqs.question_id = ?`
      ,
      [
        user_id,
        question_id,
      ]
    );
    const a = rows as QuestionShortTextsResponse[];
    return a[0];

  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function PostFavoriteFlag(request: FavoriteRequest) {
  try {
    let table_name: string = "";
    switch (request.page_mode) {
      case "英単語":
        table_name = "t_question_english_word"
        break;
      case "英文フレーズ":
        table_name = "t_question_phrase"
        break;
      case "英短文":
        table_name = "t_question_sentence"
        break;
    }

    const [rows] = await pool.query(
      `UPDATE ${table_name} tq 
       SET tq.favorite_flag = ? 
       WHERE tq.user_id = ? AND tq.question_id = ?`,
      [
        request.favorite_flag,
        request.user_id,
        request.question_id
      ]
    );

  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function ScoringSentence(sentence: string, user_ans: string) {
  // Ollamaに渡すためのmessagesを作成
  const chat_messages: OllamaApiPayload[] = [];
  chat_messages.push({
    "role": "system",
    "content": "あなたは優秀な英語教師です。以下の英文とユーザーの回答をもとに、厳密に採点してください。\n\n"
      + "【英文】\n"
      + "「" + sentence + "」\n\n"
      + "【ユーザーの回答】\n"
      + "「" + user_ans + "」\n\n"
      + "上記をもとに、以下を評価・生成してください。\n"
      + "1. 正答率（意味の正確さ・文法・自然さを総合評価）\n"
      + "2. 回答に対する具体的なアドバイス\n"
      + "3. 模範解答（自然で正確な日本語訳）\n\n"
      + "ただし、出力は**JSONオブジェクトのみ**とし、以下の形式を厳守してください。\n\n"
      + "{\n"
      + "  \"correct_ans_rate\": 0,\n"
      + "  \"advice\": \"\",\n"
      + "  \"example_answer\": \"\"\n"
      + "}\n\n"
      + "【採点基準】\n"
      + "- 100点：意味・文法ともに完全に正しい\n"
      + "- 80〜99点：細かいミスはあるが意味は正確\n"
      + "- 50〜79点：一部意味の取り違えや不自然な表現あり\n"
      + "- 0〜49点：大きな誤訳、または意味が大きく異なる\n\n"
      + "【重要な制約】\n"
      + "- JSON以外のテキストは一切出力しないこと\n"
      + "- correct_ans_rate は0〜100の整数にすること\n"
      + "- advice / example_answer は必ず文字列にすること\n"
      + "- 改行を含む場合は \\n を使用すること\n"
      + "- JSONが不正になる文字（余計な\"や制御文字）を含めないこと\n"
      + "- adviceはユーザーの誤りを具体的に指摘し、改善方法を示すこと"
  });

  // Ollamaに採点をPOST
  const result: OllamaApiResponse = await generateInferenceWithOllama(chat_messages)

  // 戻り値
  const response: ScoringQuestionSentence = JSON.parse(result.message.content)

  return response;
}