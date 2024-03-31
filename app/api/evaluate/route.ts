import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { joke } = await req.json();

  // Define the criteria for joke evaluation
  const prompt = `
    Evaluate the following joke based on humor, appropriateness, and offensiveness:
    Joke: "${joke}"
    
    Criteria:
    1. Funny or not funny
    2. Appropriate or not appropriate
    3. Offensive or not offensive
  `;

  // Ask OpenAI for a chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview', // change to gpt-3.5-turbo if gpt-4-turbo-preview is not owrking for you
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are a witty AI trained to evaluate jokes based on humor, appropriateness, and offensiveness. Please provide your evaluation.'
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Convert the response into a friendly text format
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
