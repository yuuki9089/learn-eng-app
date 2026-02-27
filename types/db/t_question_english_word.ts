export type t_question_english_word = {
    user_id: string;
    question_id: number;
    word_id: number;
    question_date: string;
    audio_file_path: string;
    option1: number;
    option2: number;
    option3: number;
    option4: number;
    scoring_result: number;
    favorite_flag: number;
    summarization: number;
    ex_sentence_en: number;
    ex_sentence_ja: number;
}