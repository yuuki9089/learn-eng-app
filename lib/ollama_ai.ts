import Stream from "stream";

export async function generateInferenceWithOllama() {
    // if (req.method !== "POST") {
    //     return res.status(405).json({ error: "Method not allowed" });
    // }

    try {

        const ollama_base_url = "http://"
            + process.env.OLLAMA_HOST
            + ":"
            + process.env.OLLAMA_PORT;

        const generate_api_url = ollama_base_url + "/api/chat";
        const body = {
            model: process.env.AI_MODEL,
            messages: [{
                role: "user",
                content: "こんにちは"
            },
            {
                role: "user",
                content: "今日の天気を教えて"
            }],
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
        // const { message } = req.body;

        // const response = await ollama.chat({
        //   model: process.env.AI_MODEL,
        //   messages: [{ role: "user", content: message }],
        // });
        return result;
        // return res.status(200).json({ message: response.message.content });
    } catch (error) {
        console.error("Ollama API error:", error);
        // return response.status(500).json({ error: "Failed to get response from LLM" });
    }
}