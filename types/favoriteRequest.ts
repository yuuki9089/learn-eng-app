import { PageMode } from "./pageMode";

export type FavoriteRequest =
  {
    user_id: string;
    question_id: number;
    favorite_flag: number;
    page_mode: PageMode
  }