
import { PostFavoriteFlag, RegesterAnsResultEnglishWord } from "@/lib/db_controls";
import { FavoriteRequest } from "@/types/favoriteRequest";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as FavoriteRequest;
    PostFavoriteFlag(body);
    return NextResponse.json(
      { message: "succeess" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}