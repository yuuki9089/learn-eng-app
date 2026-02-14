
import { RegesterAnsResultEnglishWord } from "@/lib/db_controls";
import { RegisterAnsResultEnglishWordRequest } from "@/types/RegisterAnsResultEnglishWordRequest";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RegisterAnsResultEnglishWordRequest;

    return NextResponse.json(await RegesterAnsResultEnglishWord(body));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}