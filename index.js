const express = require('express');
const cors = require('cors');
const axios = require("axios") 

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = "AIzaSyCqxgvY-k6yIYLb7cXqvR0M3Gr08BNQO2s"; // Replace with your actual API key

app.post('/api/gemini', async (req, res) => {
    try {
        const { text } = req.body;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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

  // Check if speech is provided
  if (!userSpeech) {
    return res.status(400).json({ text: "No speech input provided" });
  }

  console.log("Received Speech: ", userSpeech);

  try {
    // Send the speech input to Gemini API for generating a response
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: userSpeech }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Extract response text from Gemini's response
    const geminiResponseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

    // Respond with the generated text
    res.json({ text: geminiResponseText });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ text: "Error processing your request" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
