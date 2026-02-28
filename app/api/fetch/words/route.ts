import { auth } from "@/auth";
import { CreateEnglishWordQuestion, FetchQuestionEnglishWord } from "@/lib/flow_control";
import { QuestionRequest } from "@/types/question";
import { NextRequest, NextResponse } from "next/server";

// Post /api/questions/words
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        const question_id: number = Number(request.nextUrl.searchParams.get("id") ?? "0");

        // sessionがない場合
        if (!session) return NextResponse.json(
            { error: "UnAuthorized" },
            { status: 401 }
        );

        const user_id = session.user?.email ?? '';

        // JSONで受け取ることの定義
        // const body:QuestionRequest = await request.json();
        return NextResponse.json(await FetchQuestionEnglishWord(user_id, question_id));
    }
    catch (e) {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }
}