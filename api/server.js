require('dotenv').config(); // For environment variables (API keys)
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================
// In-memory conversation store
// ============================
let conversationHistory = []; // Each item could look like: { speaker: 'clinician' | 'patient', text: '...' }

// ================================================
// 1. Speech-to-Text (STT) Endpoint (Placeholder)
// ================================================
app.post('/api/stt', async (req, res) => {
  try {
    // Example: audio data or audio URL in the request body
    const { audioData, language } = req.body;

    // TODO: Call your STT provider here, for example:
    // const transcription = await someSTTService(audioData, language);

    // For PoC, return a dummy transcription
    const transcription = 'Hello, this is a mock transcription!';

    // Store in conversation history
    conversationHistory.push({ speaker: language === 'en' ? 'clinician' : 'patient', text: transcription });

    return res.json({ transcription });
  } catch (error) {
    console.error('STT error:', error);
    return res.status(500).json({ error: 'Speech-to-Text failed' });
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
