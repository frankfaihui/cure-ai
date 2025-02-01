require('dotenv').config(); // For environment variables (API keys)
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { transcribeAudio } = require('./services/transcription');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const { Readable } = require('stream');
const { File } = require('node:buffer');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

// ============================
// In-memory conversation store
// ============================
let conversationHistory = []; // Each item could look like: { speaker: 'clinician' | 'patient', text: '...' }
const upload = multer(); // in-memory storage


function bufferToFile(buffer, fileName) {
  // The library expects a recognized extension (e.g. .webm, .mp3, .wav)
  return new File([buffer], fileName, { type: 'audio/webm' });
}


// ================================================
// 1. Speech-to-Text (STT) Endpoint (Placeholder)
// ================================================
app.post('/api/stt', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Write to a temp file
    const tmpFile = tmp.fileSync({ postfix: '.webm' });
    fs.writeFileSync(tmpFile.name, req.file.buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: bufferToFile(req.file.buffer, 'recording.webm'),
      model: "whisper-1",
      // language: "de", // this is optional but helps the model
    });

    fs.unlinkSync(tmpFile.name);

    // 2. Use the transcript to get a Chat Completion
    const chatResponse = await openai.chat.completions.create({
      model:"gpt-4o-mini",
      messages: [
        // You can add a system message here if desired:
        {
          role: 'system',
          content: 'You are a medical assistant that provides concise answers for medical questions.'
        },
        {
          role: 'user',
          content: transcription.text
        }
      ],
      // You can add parameters like temperature, max_tokens, etc.
    });

    // Extract the model’s reply
    const aiReply = chatResponse.choices[0].message;

    return res.json({ 
      transcript: transcription.text,
      gptResponse: aiReply
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: 'Transcription failed' });
  }
});

// =================================================
// 2. Text-to-Speech (TTS) Endpoint (Placeholder)
// =================================================
app.post('/api/tts', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    // TODO: Call TTS provider here:
    // const audioUrlOrBuffer = await someTTSService(text, targetLanguage);

    // For PoC, return a dummy URL (or base64 audio)
    const audioUrlOrBuffer = 'https://fake-tts-audio.com/audio-sample';

    return res.json({ audioUrl: audioUrlOrBuffer });
  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: 'Text-to-Speech failed' });
  }
});

// =================================================
// 3. Translation Endpoint (Placeholder)
// =================================================
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    // TODO: Call translation provider (e.g. Google Translate API)
    // const translatedText = await translateService(text, sourceLanguage, targetLanguage);

    // For PoC, return a dummy translation
    const translatedText = `Translated(${targetLanguage}): ${text}`;

    return res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({ error: 'Translation failed' });
  }
});

// =============================================================
// 4. Intent Detection Endpoint (Placeholder)
//    - Could also be handled inline in STT route or after STT.
// =============================================================
app.post('/api/intent', (req, res) => {
  try {
    const { text } = req.body;

    // Simple rule-based detection for PoC:
    let intent = 'none';
    if (text.includes('follow-up')) {
      intent = 'scheduleFollowUp';
    } else if (text.includes('lab order')) {
      intent = 'sendLabOrder';
    } else if (text.includes('referral')) {
      intent = 'sendReferral';
    }

    // Return identified intent
    return res.json({ intent });
  } catch (error) {
    console.error('Intent detection error:', error);
    return res.status(500).json({ error: 'Intent detection failed' });
  }
});

// =============================================
// 5. Summary Endpoint (Placeholder)
// =============================================
app.get('/api/summary', async (req, res) => {
  try {
    // Example: Summarize entire conversation in English
    // For a quick PoC, you can do something like:
    //  - send conversationHistory to an LLM (OpenAI) for summarization
    //  - or return a simple concatenation

    // TODO: real LLM call if you want advanced summary
    // const summary = await openAILLM(conversationHistory);

    // For PoC, return a naive summary:
    const naiveSummary = conversationHistory
      .map((entry) => `${entry.speaker.toUpperCase()}: ${entry.text}`)
      .join(' | ');

    return res.json({ summary: naiveSummary });
  } catch (error) {
    console.error('Summary error:', error);
    return res.status(500).json({ error: 'Summary failed' });
  }
});

// =================================================
// 6. Clear conversation history (for debugging)
// =================================================
app.delete('/api/conversation', (req, res) => {
  conversationHistory = [];
  return res.json({ message: 'Conversation history cleared.' });
});

// =============================================
// Health Check Endpoint
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
