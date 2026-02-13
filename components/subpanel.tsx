"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from "@mui/material";
import { useState } from "react";
import TextField from "@mui/material/TextField"; // プルダウン
import Autocomplete from "@mui/material/Autocomplete"; // プルダウンの自動補完


export default function SubPanel() {
    const [selectedTab, setSelectedTab] = useState("1");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };
    const options = [
        { label: '正解', id: 1 },
        { label: '不正解', id: 2 },
        { label: 'お気に入り', id: 3 },
    ]
    return (
        <>
            {/* Right panel */}
            <Card className="w-100">
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-center">
                        <Tabs
                            value={selectedTab}
                            onChange={handleChange}
                            textColor="secondary"
                            indicatorColor="secondary"
                            aria-label="secondary tabs example"
                        >
                            <Tab value="1" label="AIチャット" />
                            <Tab value="2" label="出題履歴" />
                        </Tabs>
                        {/* <div className="flex gap-4 border-b pb-2 text-sm font-semibold">
                        <span className="border-b-2 border-black">AIチャット</span>
                        <span className="text-muted-foreground">出題履歴</span>
                    </div> */}
                    </div>
                    <div className="w-full">
                        <Autocomplete
                            disablePortal
                            options={options}
                            renderInput={(params) => <TextField {...params} label="履歴の絞り込み" />}
                        />
                    </div>


                    <HistoryItem no="No.100" text="example 1" ok />
                    <HistoryItem no="No.101" text="example 2" />
                </CardContent>
            </Card>
        </>
    );

    function HistoryItem({ no, text, ok }: any) {
        return (
            <div className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                    <p className="text-xs text-muted-foreground">{no}</p>
                    <p className="text-sm font-medium">{text}</p>
                </div>
                <div className={ok ? "text-green-500" : "text-red-500"}>
                    {ok ? "○" : "×"}
                </div>
            </div>
        );
    }
}