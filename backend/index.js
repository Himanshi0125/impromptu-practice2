import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt({ skill, purposes, categories }) {
  const skillMap = {
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced"
  };
  const purposeMap = {
    interview: "job interview",
    self: "self-improvement",
    public: "public speaking practice",
    fun: "fun or random"
  };
  const categoryMap = {
    travel: "travel",
    culture: "culture",
    abstract: "abstract concepts",
    oneword: "a single word prompt",
    technology: "technology",
    current: "current events",
    random: "any category"
  };

  const purposesText = (purposes && purposes.length)
    ? purposes.map(p => purposeMap[p] || p).join(", ")
    : "any purpose";
  const categoriesText = (categories && categories.length)
    ? categories.map(c => categoryMap[c] || c).join(", ")
    : "any category";

  // Ask for a list of topics
  return `Suggest five different impromptu speaking topics for a ${skillMap[skill] || skill} speaker, suitable for ${purposesText}, in the category of ${categoriesText}. Respond with a numbered list of just the topics.`;
}

app.post('/api/topic', async (req, res) => {
  try {
    const { skill, purposes, categories } = req.body;
    const randomizer = Math.floor(Math.random() * 100000);
    const prompt = buildPrompt({ skill, purposes, categories }) + ` [Session: ${randomizer}]`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.85,
        topP: 1
      }
    });

    const text = await result.response.text();

    // Parse the numbered list and pick one at random
    const topics = text
      .split('\n')
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);

    if (topics.length > 0) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      res.json({ topic: randomTopic });
    } else {
      res.json({ topic: "No topic generated. Please try again." });
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to fetch topic" });
  }
});

const PORT = 5050;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
