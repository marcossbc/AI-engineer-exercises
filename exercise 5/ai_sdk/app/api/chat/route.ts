import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("MESSAGES:", messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: await convertToModelMessages(messages),

    tools: {
      weather: tool({
        description: "Get the current weather for a given location",

        inputSchema: z.object({
          location: z
            .string()
            .describe("The location to get the weather for"),
        }),

        execute: async ({ location }) => {
          const apiKey = process.env.WEATHER_API_KEY;

          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
              location
            )}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }

          const data = await response.json();

          return {
            location,
            temperature: data.current.temp_c,
            condition: data.current.condition.text,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}