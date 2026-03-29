export enum PageMode
{
    WORDS = "英単語",
    PHRASES = "英文フレーズ",
    SHORT_TEXTS = "英短文"
}

export const getPageModeURL = (pagemode:PageMode, question_id:number) => {
    switch(pagemode){
        case PageMode.WORDS:
            return `/words?id=${question_id}`

        case PageMode.PHRASES:
            return `/phrases?id=${question_id}`

        case PageMode.SHORT_TEXTS:
            return `/short-texts?id=${question_id}`
    }
}