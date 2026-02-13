import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { MEnglishWord } from "@/types/server/englishWord";

/**
 * 英単語マスタを取得
 * @returns 
 */
export async function GetEnglishWord():Promise<MEnglishWord[]>
 {
  try {
    // [rows]でQueryResultだけを取得
    const [rows] = await pool.query(
      "SELECT word_id, english_word, pos, meaning1, meaning2, meaning3 "+
      "FROM m_english_word "+
      "ORDER BY word_id"
    );
    return rows as MEnglishWord[];
  } catch (err) {
    console.error(err);
    throw err;
  }
}
