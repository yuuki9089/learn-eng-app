import { OllamaApiPayload } from "./ollama_api_payload"

export type OllamaApiResponse = {
    "model": string;
    "created_at": string;
    "message": OllamaApiPayload;
    "done": boolean;
    "total_duration": number;
    "load_duration": number;
    "prompt_eval_count": number;
    "prompt_eval_duration": number;
    "eval_count": number;
    "eval_duration": number;
}