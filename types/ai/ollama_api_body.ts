import { OllamaApiPayload } from "./ollama_api_payload"

export type OllamaApiBody = {
    model:string;
    messages :OllamaApiPayload[];
    stream:boolean;
}