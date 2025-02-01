import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextInput,
  Button,
  ScrollArea,
  Text,
  Paper,
  Flex,
  Loader,
} from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import { WEBSOCKET_URL } from "@/config";

export default function ChatBotUI() {
  const [messages, setMessages] = useState<{ user: boolean; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Connect to WebSocket
  //   const ws = new WebSocket(WEBSOCKET_URL);

  //   ws.onopen = () => {
  //     console.log("Connected to WebSocket");
  //     setSocket(ws);
  //   };

  //   ws.onmessage = (event) => {
  //     setMessages((prev) => [...prev, { user: false, text: event.data }]);
  //     setLoading(false);
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket disconnected");
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      setMessages((prev) => [...prev, { user: true, text: input }]);
      setLoading(true);
      socket.send(input);
      setInput("");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <Container size="sm" mt="xl">
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <ScrollArea style={{ height: "400px", marginBottom: "1rem" }}>
          <div>
            {messages.map((message, index) =>
              message.user ? (
                <Text
                  key={index}
                  mt="sm"
                  sx={{ color: "blue", textAlign: "right" }}
                >
                  You: {message.text}
                </Text>
              ) : (
                /* Bot's message in Markdown */
                <div
                  key={index}
                  style={{ textAlign: "left", marginTop: "0.5rem" }}
                >
                  <Text fw="bold">Bot:</Text>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {loading && (
          <Flex justify="center" mt="sm">
            <Loader size="sm" />
          </Flex>
        )}

        <form onSubmit={handleSubmit}>
          <Flex mt="sm" gap="sm">
            <TextInput
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Type your message..."
              style={{ flex: 1 }}
            />
            <Button type="submit" disabled={!input.trim()}>
              Send
            </Button>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
};
