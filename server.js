const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch
const path = require('path');
require('dotenv').config(); // npm install dotenv

const app = express();
app.use(express.json());
app.use(express.static('public')); // serve the frontend

const PORT = 3000;

// AI Generate lyrics
app.post('/generate', async (req, res) => {
    const songName = req.body.song;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {role: "system", content: "You are a Kinyarwanda songwriter."},
                    {role: "user", content: `Write lyrics in Kinyarwanda for a song called "${songName}"`}
                ],
                max_tokens: 300
            })
        });
        const data = await response.json();
        const lyrics = data.choices[0].message.content;
        res.json({ lyrics });
    } catch (err) {
        res.json({ lyrics: "Error generating lyrics." });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));