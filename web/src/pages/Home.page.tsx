import React, { useState } from 'react';
import {
  AppShell,
  Box,
  Burger,
  Button,
  Card,
  Flex,
  Loader,
  NavLink,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink as RouterNavLink, Outlet } from 'react-router-dom';
import { IconMicrophone, IconRepeat } from '@tabler/icons-react';

// EXAMPLE: If you have any queries, import and use them here
// import { useQuery } from '@tanstack/react-query';
// import { fetchSubscriptions } from '../../services/subscriptionService';
// import { QUERY_KEYS } from '../../constants/queryKeys';

export default function HomePage() {
  // Control navbar toggle (for mobile view)
  const [opened, { toggle }] = useDisclosure();

  // EXAMPLE: React Query usage (optional)
  // const {
  //   data: subscriptions,
  //   isLoading: subscriptionsLoading,
  // } = useQuery({
  //   queryKey: [QUERY_KEYS.SUBSCRIPTIONS],
  //   queryFn: fetchSubscriptions,
  // });

  // -------------------------
  // Conversation State
  // -------------------------
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastClinicianText, setLastClinicianText] = useState('');
  const [lastPatientText, setLastPatientText] = useState('');

  // // Handler: Start recording STT for a speaker
  // const handleRecord = (speaker) => {
  //   setLoading(true);
  //   // TODO: integrate real STT
  //   setTimeout(() => {
  //     // Mock transcription
  //     const recognizedText = speaker === 'clinician'
  //       ? 'When was your last checkup?'
  //       : 'Mi último chequeo fue hace dos meses';

  //     setConversation((prev) => [
  //       ...prev,
  //       { speaker, text: recognizedText },
  //     ]);

  //     if (speaker === 'clinician') setLastClinicianText(recognizedText);
  //     else setLastPatientText(recognizedText);

  //     setLoading(false);
  //   }, 1500);
  // };

  // // Handler: “Repeat that” TTS
  // const handleRepeat = (speaker) => {
  //   const textToRepeat = speaker === 'clinician' ? lastClinicianText : lastPatientText;
  //   // TODO: call your TTS endpoint
  //   console.log(`Repeating for ${speaker}: `, textToRepeat);
  // };

  return (
    <AppShell
      // Mantine AppShell props
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      {/* HEADER */}
      <AppShell.Header>
        <Flex justify="space-between" align="center" sx={{ height: '100%' }} px="md">
          <Box>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Box>
          <Title order={3}>CuraAI (Interpreter Example)</Title>
        </Flex>
      </AppShell.Header>

      {/* NAVBAR */}
      <AppShell.Navbar>
        {/* Scrollable area for links, etc. */}
        <AppShell.Section grow component={ScrollArea} p="sm">
          {/* Example NavLinks (RouterNavLink usage) */}
          <NavLink
            label="New Subscription"
            component={RouterNavLink}
            to="/my-list/new-subscription"
            variant="light"
          />
          <NavLink
            label="Another Route"
            component={RouterNavLink}
            to="/some-other-route"
            variant="light"
          />

          {/* If you had dynamic data from React Query, you could map it here */}
          {/* 
            {subscriptionsLoading ? (
              <Loader />
            ) : (
              subscriptions?.data?.map((sub) => (
                <NavLink
                  key={sub.id}
                  label={sub.topic}
                  component={RouterNavLink}
                  to={`/my-list/${sub._id}`}
                  variant="light"
                />
              ))
            )}
          */}
        </AppShell.Section>

        <AppShell.Section p="sm">
          <Button component={RouterNavLink} to="/sign-out" variant="subtle">
            Sign Out
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* MAIN Content Area */}
      <AppShell.Main>
        {/* If you have nested routes, they render here */}
        <Outlet />

        {/* Example: Our conversation UI below */}
        <Title order={4} mt="lg">
          Interpreter Demo
        </Title>

        {loading && (
          <Loader variant="dots" size="lg" mt="md" />
        )}

        {/* Render conversation */}
        {conversation.map((msg, idx) => (
          <Card key={idx} shadow="sm" my="sm" p="md" withBorder>
            {/* <Text weight={600} color={msg.speaker === 'clinician' ? 'blue' : 'green'}>
              {msg.speaker.toUpperCase()}
            </Text> */}
            <Text>{msg.text}</Text>
          </Card>
        ))}

        <Flex mt="md" gap="md" wrap="wrap" justify="start">
          {/* Clinician Controls */}
          <Button
            leftIcon={<IconMicrophone size={18} />}
          // onClick={() => handleRecord('clinician')}
          >
            Clinician Speak
          </Button>
          <Button
            variant="outline"
            leftIcon={<IconRepeat size={18} />}
          // onClick={() => handleRepeat('clinician')}
          >
            Repeat Clinician
          </Button>

          {/* Patient Controls */}
          <Button
            color="green"
            leftIcon={<IconMicrophone size={18} />}
          // onClick={() => handleRecord('patient')}
          >
            Patient Speak
          </Button>
          <Button
            variant="outline"
            color="green"
            leftIcon={<IconRepeat size={18} />}
          // onClick={() => handleRepeat('patient')}
          >
            Repeat Patient
          </Button>
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
}
