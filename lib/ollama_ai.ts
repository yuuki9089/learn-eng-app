import { OllamaApiBody } from "@/types/ai/ollama_api_body";
import { OllamaApiPayload } from "@/types/ai/ollama_api_payload";
import Stream from "stream";

export async function generateInferenceWithOllama(messages:OllamaApiPayload[]) {

    try {
        const ollama_base_url = "http://"
            + process.env.OLLAMA_HOST
            + ":"
            + process.env.OLLAMA_PORT;

        const generate_api_url = ollama_base_url + "/api/chat";
        const body: OllamaApiBody = {
            model: process.env.AI_MODEL || '',
            messages: messages,
            stream: false
        }

        const response = await fetch(generate_api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        },
        )
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Ollama API error:", error);
    }
}