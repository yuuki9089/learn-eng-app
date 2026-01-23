"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Book, FileText, Settings, User } from "lucide-react";


// export default function Sidebar({ children }: { children: React.ReactNode }) {
export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();


    return (
        <div className="flex h-screen bg-gray-50">
            {/* Hamburger */}
            <button
                className="md:hidden p-2 absolute top-4 left-4 z-50 bg-white shadow rounded"
                onClick={() => setOpen(!open)}
            >
                ☰
            </button>


            {/* Sidebar */}
            <aside
                className={`${open ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 transition-transform w-64 bg-white shadow-xl p-6 flex flex-col gap-4 h-full fixed md:static z-40`}
            >
                <h1 className="text-2xl font-bold mb-4">LearnEngApp</h1>
                <nav className="flex flex-col gap-3">
                    <NavLink href="/" active={pathname === "/home"}><Home size={20} /> ホーム</NavLink>
                    <NavLink href="/words" active={pathname === "/words"}><Book size={20} /> 英単語</NavLink>
                    <NavLink href="/phrases" active={pathname === "/phrases"}><FileText size={20} /> 英文フレーズ</NavLink>
                    <NavLink href="/short-texts" active={pathname === "/short-texts"}><FileText size={20} /> 英短文</NavLink>
                    <NavLink href="/settings" active={pathname === "/settings"}><Settings size={20} /> 設定</NavLink>
                    <NavLink href="/logout" active={pathname === "/logout"} className="mt-4"><User size={20} /> ログアウト</NavLink>
                </nav>
            </aside>


            {/* Main
            <main className="flex-1 p-10 overflow-auto">{children}</main> */}
        </div>
    );
}


function NavLink({ href, active, children, className = "" }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 text-lg hover:text-blue-600 ${active ? "text-blue-600 font-semibold" : ""} ${className}`}
        >
            {children}
        </Link>
    );
}