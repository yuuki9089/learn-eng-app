import { PageMode } from "./pageMode";

export type historyRequest = {
    user_id: string;
    page_mode: PageMode;
    conditions: string
}