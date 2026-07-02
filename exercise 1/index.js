import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const Openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateResponse = async (prompt) => {
    const response = await Openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 1000,
        stream:true
    });

    let fullResponse = '';

    for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";
        if(content){
            process.stdout.write(content);
            fullResponse += content;
        }
    }

    console.log("\n\n stream complete:", fullResponse);

    return fullResponse;
};

const result = await generateResponse(
    "Write a short poem about the beauty of nature."
);

console.log(result);