import React, { useState, useRef } from 'react';
import hark from 'hark';         // <-- For speech detection
import { Button, Title, Text, Stack, Container } from '@mantine/core';
import { API_BASE_URL } from '@/config';

const AudioRecorder: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechEventsRef = useRef<any>(null);

  // 1. Start auto-detecting speech
  const startAutoRecording = async () => {
    try {
      // Ask for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use hark to detect "speaking" / "stopped_speaking" events
      const speechEvents = hark(stream, {});
      speechEventsRef.current = speechEvents;

      // Create a MediaRecorder for the same stream
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // When hark detects speech, start recording if not already
      speechEvents.on('speaking', () => {
        if (mediaRecorder.state !== 'recording') {
          console.log('Speech detected: starting recording...');
          mediaRecorder.start();
        }
      });

      // When hark detects silence, stop recording if currently recording
      speechEvents.on('stopped_speaking', () => {
        if (mediaRecorder.state === 'recording') {
          console.log('Silence detected: stopping recording...');
          mediaRecorder.stop();
        }
      });

      // Each time we stop, ondataavailable fires with the final chunk
      mediaRecorder.ondataavailable = async (event: BlobEvent) => {
        if (event.data.size > 0) {
          // Upload this chunk to the server
          const audioBlob = event.data; // WebM Opus by default in Chrome
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          try {
            const response = await fetch(`${API_BASE_URL}/api/stt`, {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();

            // Append new transcripts
            setTranscript((prev) => prev + (data.transcript || '[No transcript]') + '\n');
          } catch (err) {
            console.error('Transcription error:', err);
          }
        }
      };

      setIsDetecting(true);
    } catch (error) {
      console.error('Could not access microphone:', error);
    }
  };

  // 2. Stop everything manually
  const stopAutoRecording = () => {
    // If we're currently recording, stop it
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Stop all audio tracks
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    // Stop hark from listening further
    if (speechEventsRef.current) {
      speechEventsRef.current.stop();
    }

    setIsDetecting(false);
  };

  return (
    <Container>
      <Stack spacing="md">
        <Title order={3}>Speak to your AI medical assistance</Title>

        <Stack spacing="xs" direction="row">
          <Button
            onClick={startAutoRecording}
            disabled={isDetecting}
            variant="filled"
            color="blue"
          >
            Start Auto-Detect
          </Button>

          <Button
            onClick={stopAutoRecording}
            disabled={!isDetecting}
            variant="filled"
            color="red"
          >
            Stop
          </Button>
        </Stack>

        <div>
          <Text weight={500}>Transcript (appended each time speaking stops):</Text>
          <Text>{transcript}</Text>
        </div>
      </Stack>
    </Container>
  );
};

export default AudioRecorder;
