import { auth } from "@/auth";
import { CreateEnglsihWordQuestion } from "@/lib/flow_control";
import { QuestionRequest } from "@/types/question";
import { NextRequest, NextResponse } from "next/server";

// Post /api/questions/words
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // sessionがない場合
        if (!session) return NextResponse.json(
            { error: "UnAuthorized" },
            { status: 401 }
        );
        
    const user_id = session.user?.email ?? '';

    // JSONで受け取ることの定義
    // const body:QuestionRequest = await request.json();
    return NextResponse.json(await CreateEnglsihWordQuestion(user_id));
}
    catch (e) {
    return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
    );
}
}