import React, { useState, useRef, useEffect } from 'react';
import hark from 'hark';
import {
  Button,
  Text,
  Stack,
  Container,
  ScrollArea,
  Paper,
  Title,
  Flex,
  Loader,
} from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { API_BASE_URL } from '@/config';

interface Message {
  user: boolean; // true for user, false for bot
  text: string;
}

const AudioRecorder: React.FC = () => {
  const [chatId, setChatId] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechEventsRef = useRef<any>(null);

  // For auto-scrolling to the bottom of the chat
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate a unique chat ID when the component mounts
  useEffect(() => {
    const newChatId = `chat-${Date.now()}`;
    setChatId(newChatId);
    startAutoRecording();
    return () => {
      stopAutoRecording();
    };
  }, []);

  // Start auto-detecting speech and recording
  const startAutoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const speechEvents = hark(stream, {});
      speechEventsRef.current = speechEvents;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Start recording when speech is detected
      speechEvents.on('speaking', () => {
        if (mediaRecorder.state !== 'recording') {
          console.log('Speech detected: starting recording...');
          mediaRecorder.start();
        }
      });

      // Stop recording when silence is detected
      speechEvents.on('stopped_speaking', () => {
        if (mediaRecorder.state === 'recording') {
          console.log('Silence detected: stopping recording...');
          mediaRecorder.stop();
        }
      });

      // Handle recorded audio chunks
      mediaRecorder.ondataavailable = async (event: BlobEvent) => {
        if (event.data.size > 0) {
          setLoading(true);
          const audioBlob = event.data;
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('chatId', chatId);

          try {
            const response = await fetch(`${API_BASE_URL}/api/stt`, {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            // data contains: { transcript: "User's text", aiResponse: "Bot's reply" }

            setMessages((prev) => [
              ...prev,
              { user: true, text: data.transcript || '[No user transcript]' },
              { user: false, text: data.aiResponse || '[No AI response]' },
            ]);
          } catch (err) {
            console.error('Transcription error:', err);
          } finally {
            setLoading(false);
          }
        }
      };

      setIsDetecting(true);
    } catch (error) {
      console.error('Could not access microphone:', error);
    }
  };

  // Stop recording and clean up resources
  const stopAutoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (speechEventsRef.current) {
      speechEventsRef.current.stop();
    }
    setIsDetecting(false);
  };

  return (
    <Container size="sm" mt="xl">
      <Stack spacing="md">
        <Title order={3}>Speak to Your AI Medical Assistant</Title>
        <Flex gap="md">
          <Button onClick={startAutoRecording} disabled={isDetecting} color="blue">
            Start
          </Button>
          <Button onClick={stopAutoRecording} disabled={!isDetecting} color="red">
            Stop
          </Button>
          {loading && <Loader size="sm" />}
        </Flex>
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <ScrollArea style={{ height: 400, marginBottom: '1rem' }}>
            {messages.map((msg, index) =>
              msg.user ? (
                <Text key={index} mt="sm" sx={{ color: 'blue', textAlign: 'right' }}>
                  You: {msg.text}
                </Text>
              ) : (
                <div key={index} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                  <Text fw="bold">Bot:</Text>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )
            )}
            <div ref={bottomRef} />
          </ScrollArea>
        </Paper>
      </Stack>
    </Container>
  );
};

export default AudioRecorder;
