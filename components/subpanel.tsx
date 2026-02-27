"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField"; // プルダウン
import Autocomplete from "@mui/material/Autocomplete"; // プルダウンの自動補完
import { historyResponse } from "@/types/historyResponse";
import { conditionds } from "@/types/conditions";
import { historyRequest } from "@/types/historyRequest";
import { PageMode } from "@/types/pageMode";
import React from "react";

type Props = {
    user_id: string;
    page_mode: PageMode;
}

export default function SubPanel({ user_id, page_mode }: Props) {
    const [selectedTab, setSelectedTab] = useState("1");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };
    const options = [
        { label: conditionds.CORRECT, id: 1 },
        { label: conditionds.INCORRECT, id: 2 },
        { label: conditionds.FAVORITE, id: 3 },
    ]
    const [history, setHsitory] = useState<historyResponse[]>();
    useEffect(() => {
        selectedHandleChange("")
    }, []);

    const selectedHandleChange = async (conditions: string) => {
        const request: historyRequest = {
            user_id: user_id,
            page_mode: page_mode,
            conditions: conditions
        }

        const response = await fetch("/api/history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })

        const data: historyResponse[] = await response.json();
        setHsitory(data);

    }

    return (
        <>
            {/* Right panel */}
            <Card className="flex flex-col w-100 h-screen">
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
                            // 選択変更時
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    console.log("選択された値:", newValue);
                                    console.log("id:", newValue.id);
                                    console.log("label:", newValue.label);

                                    selectedHandleChange(newValue?.label ?? "");
                                }
                            }}
                            renderInput={(params) => <TextField
                                // caption
                                {...params} label="履歴の絞り込み"

                                // 絞り込み条件の変更時
                                onChange={(e) => selectedHandleChange(e.target.value)}
                            />}

                        />
                    </div>
                </CardContent>

                <CardContent className="h-100 overflow-auto space-y-4">
                    {history?.map((h) =>
                        <React.Fragment key={h.question_id}>
                            <HistoryItem
                                no={h.question_id}
                                text={h.english_word}
                                result={h.result === 1 ? "ok"
                                    : h.result === 2 ? "ng"
                                        : h.result === 3 ? "skip"
                                            : ""
                                }
                            />
                        </React.Fragment>
                    )}

                </CardContent>
            </Card >
        </>
    );

    function HistoryItem({ no, text, result }: any) {
        function ansResult(result: string) {
            switch (result) {
                case "ok":
                    return "◯"
                case "skip":
                    return "△"
                case "ng":
                    return "✕"
            }

        }
        function textColor(result: string) {
            switch (result) {
                case "ok":
                    return "text-green-500"
                case "skip":
                    return "text-blue-500"
                case "ng":
                    return "text-red-500"
            }
        }
        return (
            <div className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                    <p className="text-xs text-muted-foreground">{no}</p>
                    <p className="text-sm font-medium">{text}</p>
                </div>
                <div className={textColor(result)}>
                    {ansResult(result)}
                </div>
            </div>
        );
    }
}