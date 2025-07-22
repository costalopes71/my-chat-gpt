export const dynamic = 'force-static';
import OpenAI from "openai";

const config = {
  apiKey: process.env.OPENAI_API_KEY,
};

const client = new OpenAI(config);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.query || typeof body.query !== 'string') {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'query' in request body." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await client.responses.create({
        model: "gpt-4o",
        input: body.query
    });

    console.log(response.output_text);

    return Response.json({ response: response.output_text });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
