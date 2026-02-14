import { NextResponse, userAgent } from "next/server";
import { pool } from "@/lib/db";
import { MEnglishWord } from "@/types/server/englishWord";
import { QuestionEnglishWordResponse } from "@/types/questionEnglishWordResponse";
import { type } from "os";
import { EXSentenceResponse } from "@/types/exSentenceResponse";

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
        option4
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request.user_id,
        request.question_id,
        request.word_id,
        request.question_date,
        request.audio_file_path,
        request.option[0].meaning1,
        request.option[1].meaning1,
        request.option[2].meaning1,
        request.option[3].meaning1
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
 * 英単語出題テーブルに登録
 * @param request 
 * @returns 
 */
export async function RegesterEXSentenceEnglishWord(request: EXSentenceResponse) {
  try {
    const [result]: any = await pool.execute(
      `UPDATE t_question_english_word tqew
      SET tqew.ex_sentence_en = ?, tqew.ex_sentence_ja = ?
      WHERE tqew.user_id = ? AND tqew.question_id = ?`,
      [
        request.ex_sentence_en,
        request.ex_sentence_ja,
        request.user_id,
        request.question_id
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