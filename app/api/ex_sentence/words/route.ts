
import { EXSentenceRequest } from "@/types/exSentenceRequest";
import { NextRequest, NextResponse } from "next/server";
import { GenEXSentence } from "@/lib/flow_control";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EXSentenceRequest;
    const { user_id, question_id, word_id } = body;

    // if (!user_id || !question_id || word_id) {
    //   return NextResponse.json(
    //     { error: "user_id or question_id or word_id is required" },
    //     { status: 400 }
    //   );
    // }
    return NextResponse.json(await GenEXSentence(body));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}