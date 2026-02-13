import Sidebar from "@/components/sidebar";
import SubPanel from "@/components/subpanel";
import { PageMode } from "@/types/pageMode";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Home, LogOut, Settings, BookOpen, FileText, MessageSquare, Volume2 } from "lucide-react";
import CheckBox from '@mui/material/Checkbox';
import PhrasesComponent from "@/components/page/phrasesComponent";

export default async function Phrases() {

  return (
    <>
      <div className="flex bg-[#f9fafb]">
        <Sidebar />
        <PhrasesComponent/>
        <SubPanel />
      </div>
    </>
  );
}