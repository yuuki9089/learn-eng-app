import { NextResponse, userAgent } from "next/server";
import { pool } from "@/lib/db";
import { MEnglishWord } from "@/types/db/englishWord";
import { QuestionEnglishWordResponse } from "@/types/englishWord/questionEnglishWordResponse";
import { type } from "os";
import { EXSentenceResponse } from "@/types/englishWord/exSentenceResponse";
import { RegisterAnsResultEnglishWordRequest } from "@/types/RegisterAnsResultEnglishWordRequest";
import { searchCurrentQuestionEnglishWord } from "@/types/searchCurrentQuestionEnglishWord";
import { FavoriteRequest } from "@/types/favoriteRequest";
import { t_question_english_word } from "@/types/db/t_question_english_word";
import { number } from "motion";
import { t_question_sentence } from "@/types/db/t_question_sentence";

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
    console.log("DB_inserted");
    return NextResponse.json({
      success: true,
    });
  }
  catch (error) {
    console.error("INSERT ERROR:", error);
    return NextResponse.json(
      { error: "DB Insert Failed" },
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
export async function RegesterAnsResultEnglishWord(request: RegisterAnsResultEnglishWordRequest) {
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
    console.log("DB_inserted registerAns");
    return NextResponse.json({
      success: true,
    });
  }
  catch (error) {
    console.error("INSERT ERROR:", error);
    return NextResponse.json(
      { error: "DB Insert Failed" },
      { status: 500 }
    );
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