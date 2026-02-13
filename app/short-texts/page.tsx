import Sidebar from "@/components/sidebar";
import SubPanel from "@/components/subpanel";
import { PageMode } from "@/types/pageMode";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Home, LogOut, Settings, BookOpen, FileText, MessageSquare, Volume2 } from "lucide-react";
import CheckBox from '@mui/material/Checkbox';
import ShortTextsComponent from "@/components/page/shortTextsComponent";

export default async function ShortTexts() {

  return (
    <>
      <div className="flex bg-[#f9fafb]">
        <Sidebar />
        <ShortTextsComponent />
        <SubPanel />
      </div>
    </>
  );
}