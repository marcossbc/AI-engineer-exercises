import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversations = [
  {
    file: "speaker1.mp3",
    voice: "coral",
    text: "Hi! I'm excited to tell you about artificial intelligence.",
    instructions: "Speak in a cheerful, energetic, and excited tone.",
  },
  {
    file: "speaker2.mp3",
    voice: "alloy",
    text: "That's interesting. Can you explain how AI helps people every day?",
    instructions: "Speak in a calm, curious, and friendly tone.",
  },
  {
    file: "speaker3.mp3",
    voice: "verse",
    text: "ai waa caawiye bes ee  maha mid shaqada developer naga badalayo🙄😂😂.",
    instructions: "Speak confidently like a knowledgeable teacher.",
  },
];

if (!fs.existsSync("audio")) {
  fs.mkdirSync("audio");
}

for (const speaker of conversations) {
  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: speaker.voice,
    input: speaker.text,
    instructions: speaker.instructions,
  });

  const buffer = Buffer.from(await response.arrayBuffer());

  await fs.promises.writeFile(
    path.join("audio", speaker.file),
    buffer
  );

  console.log(`Saved: ${speaker.file}`);
}

console.log("All conversation audio files generated!");