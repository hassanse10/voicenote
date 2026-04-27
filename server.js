require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const PROMPTS = {
    grammar: (text) => `Fix the grammar, punctuation, and remove filler words (um, uh, like, you know) from this speech transcript. Return ONLY the corrected text, no explanations:\n\n${text}`,
    summarize: (text) => `Summarize this speech transcript into 2-4 concise bullet points capturing the key ideas. Return ONLY the bullet points starting with "•", no intro or explanations:\n\n${text}`,
    format: (text) => `Auto-detect if this speech transcript is best formatted as an email, a to-do list, or a structured note, then format it accordingly. Return ONLY the formatted result with a clear structure, no meta-commentary:\n\n${text}`,
};

app.post('/api/process', async (req, res) => {
    const { text, operation } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({ error: 'No text provided' });
    }

    if (!PROMPTS[operation]) {
        return res.status(400).json({ error: 'Invalid operation. Use: grammar, summarize, or format' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
        return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured. Create a .env file.' });
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': 'VoiceNote',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-haiku-4-5',
                max_tokens: 1024,
                messages: [{ role: 'user', content: PROMPTS[operation](text) }],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || `OpenRouter error ${response.status}`);
        }

        const result = data.choices[0].message.content;
        res.json({ result });
    } catch (err) {
        console.error('OpenRouter API error:', err.message);
        res.status(500).json({ error: 'AI processing failed: ' + err.message });
    }
});

app.listen(PORT, () => {
    console.log(`VoiceNote server running at http://localhost:${PORT}`);
    if (!process.env.OPENROUTER_API_KEY) {
        console.warn('WARNING: OPENROUTER_API_KEY is not set. Copy .env.example to .env and add your key.');
    }
});
