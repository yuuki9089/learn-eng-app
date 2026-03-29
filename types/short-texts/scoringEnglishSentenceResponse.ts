export type ScoringEnglishSentenceResponse = {
    user_id: string,
    question_id: number,
    scoring_result: number,
    user_ans: string,
    correct_ans_rate: number,
    example_answer: string,
    advice: string
}