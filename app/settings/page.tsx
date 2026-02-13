import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CheckBox from '@mui/material/Checkbox';

export default async function Settings() {

  return (
    <>
      <div className="flex bg-[#f9fafb]">
        <Sidebar />
        <div className="w-full px-100 pt-30">
          <Card>
            <div className="pl-10">
              {/* Title */}
              <CardTitle className="text-3xl">
                設定
              </CardTitle>

              <CardContent>
                <CardTitle className="text-2xl pt-10">
                  学習方式
                </CardTitle>
                <CardContent>
                  <div className="flex flex-col py-3 text-xl">
                    <div className="flex items-center">
                      <CheckBox color='success' />
                      <div>
                        過去に間違えた単語からフレーズを作成する
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckBox color='success' />
                      <div>
                        過去に間違えた単語からセンテンスを生成する
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardTitle className="text-2xl">
                  音量
                </CardTitle>

                <CardTitle className="text-2xl">
                  単語
                </CardTitle>
                <CardContent>
                  <div className="flex flex-col py-3 text-xl">
                    <div className="flex items-center">
                      <CheckBox color='success' />
                      <div>
                        間違えた単語から出題する
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckBox color='success' />
                      <div>
                        過去に出題された問題の回答をはじめから表示する
                      </div>
                    </div>
                  </div>
                </CardContent>

              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}