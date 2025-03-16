import express from "express"
import cors from "cors"
import axios from "axios";
import dotenv from "dotenv"

const app = express();
dotenv.config();

const PORT = 5000;
const corsOptions = {
  origin: [
    "https://zipgen.vercel.app",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  try {
      const { text } = req.body;

      const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
              contents: [{ parts: [{ text }] }]
          },
          {
              headers: { 'Content-Type': 'application/json' }
          }
      );

      res.json(response.data);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to fetch response" });
  }
});

app.post("/api/voice", async (req, res) => {
  const userSpeech = req.body.speech;

  if (!userSpeech) {
    return res.status(400).json({ text: "No speech input provided" });
  }

  console.log("Received Speech: ", userSpeech);

  try {
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: userSpeech }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const geminiResponseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

    res.json({ text: geminiResponseText });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ text: "Error processing your request" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Express on Vercel!");
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));


export default app;
