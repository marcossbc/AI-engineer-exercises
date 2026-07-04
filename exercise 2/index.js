import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt =
  "Create a cute and playful illustration of an otter floating on its back in a serene river, surrounded by lush greenery and colorful flowers. The otter should have a joyful expression, holding a small fish in its paws. The scene should be vibrant, whimsical, and full of life, capturing the essence of nature's beauty and the otter's playful character.";
// kan danbe😍
// const result = await openai.images.generate({
//     model: "gpt-image-1",
//     prompt,
// });

// kii hore folxumo😂
const result = await openai.images.generate({
  model: "dall-e-3",
  prompt: "A futuristic cityscape at sunset with flying cars",
  n: 1,
  size: "1792x1024",
  quality: "hd", 
  style: "vivid", 
  response_format: "b64_json", 
});

// Create images folder if it doesn't exist
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

// Save the image to a file
const image_base64 = result.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("images/otter.png", image_bytes);

console.log("Image saved as images/otter.png");
