import Anthropic from "@anthropic-ai/sdk"
import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`


const getCustomFetch = (apiBaseUrl, proxyPath) => {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    if (!isLocal) return undefined
    return (url, init) => {
        const urlStr = url.toString()
        const proxiedUrl = urlStr.replace(apiBaseUrl, proxyPath)
        return fetch(proxiedUrl, init)
    }
}

export async function getRecipeFromChefClaude(ingredientsArr, apiKey) {
    const ingredientsString = ingredientsArr.join(", ")
    const finalApiKey = apiKey || process.env.ANTHROPIC_API_KEY

    if (!finalApiKey) {
        throw new Error("Anthropic API key is not configured. Please add it in the settings or environment variables.")
    }

    const client = new Anthropic({
        apiKey: finalApiKey,
        fetch: getCustomFetch("https://api.anthropic.com", "/api/anthropic"),
        dangerouslyAllowBrowser: true,
    })

    const msg = await client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
            { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
        ],
    })
    return msg.content[0].text
}

export async function getRecipeFromHuggingFace(ingredientsArr, apiKey) {
    const ingredientsString = ingredientsArr.join(", ")
    const token = apiKey || process.env.HF_ACCESS_TOKEN

    if (!token) {
        throw new Error("Hugging Face Access Token is not configured. Please add it in the settings or environment variables.")
    }

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    const hf = new HfInference(token).endpoint(
        isLocal ? "/api/huggingface" : "https://router.huggingface.co"
    )

    try {
        const response = await hf.request({
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        }, {
            chatCompletion: true
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
        throw err
    }
}
