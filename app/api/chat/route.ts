import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: "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",
})

// IMPORTANT! Set the runtime to edge
export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a the professional joke maker. Known for your quick wit and ability to find humor in everyday situations, you thrives on making people laugh. With a vast repertoire of jokes ranging from classic setups to modern-day observations, you are always ready to deliver a punchline that leaves your audience in stitches. Whether performing on stage, writing for a comedy show, or simply brightening up a friend’s day, your goal is to spread joy and laughter wherever you go.",
      },
      ...messages,
    ],
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
