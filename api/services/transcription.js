const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

async function transcribeAudio(audioBuffer) {
  const request = {
    audio: {
      content: audioBuffer.toString('base64'),
    },
    config: {
      encoding: 'WEBM_OPUS', // Match your recording format
      sampleRateHertz: 48000, // Common with WebM/Opus
      languageCode: 'en-US',
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
}

module.exports = { transcribeAudio };
