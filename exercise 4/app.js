import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

const topic = "The Future of Artificial Intelligence";


try {
  console.log("Generating article...");

  const articleResponse = await openai.responses.create({
    model: "gpt-5",
    input: `Write a professional article about ${topic}.`,
  });

  const article = articleResponse.output_text;

  fs.writeFileSync("output/article.txt", article);

  console.log("Generating summary...");

  const summaryResponse = await openai.responses.create({
    model: "gpt-5",
    input: `Summarize this article:\n\n${article}`,
  });

  
  const summary = summaryResponse.output_text;

  fs.writeFileSync("output/summary.txt", summary);

  console.log("Generating social post...");

  const socialResponse = await openai.responses.create({
    model: "gpt-5",
    input: `Create a LinkedIn post using this article:\n\n${article}`,
  });

  const social = socialResponse.output_text;

  fs.writeFileSync("output/social.txt", social);

  console.log("Generating image...");

  const image = await openai.images.generate({
    model: "gpt-image-1",
    prompt: `Technology thumbnail about ${topic}`,
  });

  const imageBase64 = image.data[0].b64_json;

  fs.writeFileSync("output/thumbnail.png", Buffer.from(imageBase64, "base64"));

  console.log("Generating audio...");

  const speech = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: summary,
  });

  const audio = Buffer.from(await speech.arrayBuffer());

  fs.writeFileSync("output/audio.mp3", audio);

  console.log("✅ Project completed successfully!");
} catch (error) {
  console.log("Error:", error.message);
}
