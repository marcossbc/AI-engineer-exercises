import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline/promises";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



const reads = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const topic = await reads.question(
  " Enter a topic for your blog post: "
);

const generateBlogOutline = async (topic) => {
  console.log("\n Generating Blog Outline...\n");

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Create a detailed blog post outline about ${topic}`,
      },
    ],
    stream: true,
  });

  let outline = "";

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";

    if (content) {
      process.stdout.write(content);
      outline += content;
    }
  }

  console.log("\n");
  return outline;
};


const summarizeOutline = async (outline) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Summarize this outline in exactly 2 sentences:\n\n${outline}`,
      },
    ],
  });

  return response.choices[0].message.content;
};


const answerQuestion = async (topic, question) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert blog assistant. Answer questions about ${topic}.`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return response.choices[0].message.content;
};


const outline = await generateBlogOutline(topic);

console.log(" BLOG OUTLINE:");
console.log(outline);

const summary = await summarizeOutline(outline);

console.log("\n SUMMARY:");
console.log(summary);


while (true) {
  const question = await reads.question(
    "\n Ask a follow-up question (or type 'exit'): "
  );

  if (question.toLowerCase() === "exit") {
    console.log("\n Goodbye!");
    break;
  }

  const answer = await answerQuestion(topic, question);

  console.log("\n Answer:");
  console.log(answer);
}

reads.close();