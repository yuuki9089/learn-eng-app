
import { PostFavoriteFlag, RegesterAnsResultEnglishWord } from "@/lib/db_controls";
import { GetQuestionHistory } from "@/lib/flow_control";
import { FavoriteRequest } from "@/types/favoriteRequest";
import { historyRequest } from "@/types/historyRequest";
import { historyResponse } from "@/types/historyResponse";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as historyRequest;
    const response:historyResponse[] = await GetQuestionHistory(body);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}