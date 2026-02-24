import { PageMode } from "./pageMode";

export type FavoriteRequest =
  {
    user_id: string;
    question_id: number;
    favorite_flag: boolean;
    page_mode: PageMode
  }