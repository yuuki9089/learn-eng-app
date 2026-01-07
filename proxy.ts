import { NextResponse } from 'next/server';
import { auth } from "./auth";

export async function proxy(request: { url: string | URL | undefined }) {
    console.log("request.url", request.url)

    // セッション情報を取得
    // セッションが真：構造体を取得
    // セッションが偽：null
    const session = await auth();

    // セッションが無効のとき
    if (!session) {
        // URLが「～/login」の場合(正しい遷移)の場合
        if (String(request.url).match(/^.+login$/)) {
            // 遷移を許可
            return NextResponse.next();
        }

        // 異常なURLの場合
        // loginへ強制的に遷移
        console.log("URL：" + new URL("/login", request.url))
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (
        String(request.url).match(/^.+login$/) || 
        String(request.url).match(/^.+\/$/)
    ) {
        return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};