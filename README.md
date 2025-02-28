# AI Medical Assistant (Hackathon Project)

A quick **prototype** that records speech, transcribes it via **OpenAI Whisper**, and generates **concise, medically oriented replies** using **GPT**. The **Node/Express** server handles transcription and chat logic, while the **React** frontend automatically detects speech, records audio, and displays a simple chat interface.

---

### Key Features
1. **Hands-Free**: App detects speech and starts/stops recording automatically (using `hark`).
2. **OpenAI Whisper**: Converts speech to text.
3. **GPT Responses**: Provides medical context answers in real time.
