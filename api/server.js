require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const { File } = require('node:buffer');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

// ============================================
// In-memory conversation store per chatId
// ============================================
let conversationHistories = {}; // Example structure: { chatId1: [ { role: 'user'|'assistant', content: '...' } ], chatId2: [...] }
const upload = multer(); // in-memory storage

function bufferToFile(buffer, fileName) {
  return new File([buffer], fileName, { type: 'audio/webm' });
}

// ================================================
// 1. Speech-to-Text (STT) and Chat Endpoint
// ================================================
app.post('/api/stt', upload.single('audio'), async (req, res) => {
  try {
    const chatId = req.body.chatId || 'default';

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Ensure a conversation history exists for this chatId
    if (!conversationHistories[chatId]) {
      conversationHistories[chatId] = [];
    }

    // Transcribe audio using the Whisper model
    const transcription = await openai.audio.transcriptions.create({
      file: bufferToFile(req.file.buffer, 'recording.webm'),
      model: "whisper-1",
      // Optional: specify language if needed, e.g., language: "de"
    });

    // Append the transcribed text as a user message to the conversation history
    conversationHistories[chatId].push({ role: 'user', content: transcription.text });

    // Create a chat completion including the full conversation history
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: 'You are a medical assistant that provides concise answers for medical questions.'
        },
        ...conversationHistories[chatId]
      ],
      // Optional: additional parameters such as temperature or max_tokens
    });

    // Extract and save the assistant's reply
    const aiResponse = chatResponse.choices[0].message?.content;
    conversationHistories[chatId].push({ role: 'assistant', content: aiResponse });

    return res.json({
      transcript: transcription.text,
      aiResponse
    });
  } catch (error) {
    console.error('Transcription/Chat error:', error);
    return res.status(500).json({ error: 'Transcription or chat completion failed' });
  }
});

// =============================================
// 2. Summary Endpoint
// =============================================
app.get('/api/summary', async (req, res) => {
  try {
    const chatId = req.query.chatId;
    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }
    if (!conversationHistories[chatId]) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Create a simple summary by concatenating all messages for this chat
    const naiveSummary = conversationHistories[chatId]
      .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
      .join(' | ');

    return res.json({ summary: naiveSummary });
  } catch (error) {
    console.error('Summary error:', error);
    return res.status(500).json({ error: 'Summary failed' });
  }
});

// =============================================
// Health Check Endpoints
// =============================================
app.get('/health', (req, res) => {
  return res.json({ status: 'Server is healthy' });
});

app.get('/', (req, res) => {
  return res.json({ status: 'Ok' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
