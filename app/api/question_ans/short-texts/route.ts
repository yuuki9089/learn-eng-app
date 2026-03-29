
import { RegesterAnsResultEnglishWord, RegesterAnsResultShortTexts } from "@/lib/db_controls";
import { RegisterAnsResultRequest } from "@/types/RegisterAnsResultRequest";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RegisterAnsResultRequest;

    return NextResponse.json(await RegesterAnsResultShortTexts(body));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}