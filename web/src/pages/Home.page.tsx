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
import AudioRecorder from '@/components/AudioRecorder';

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
          <Title order={3}>CuraAI</Title>
        </Flex>
      </AppShell.Header>

      {/* NAVBAR */}
      <AppShell.Navbar>
        {/* Scrollable area for links, etc. */}
        <AppShell.Section grow component={ScrollArea} p="sm">
          {/* Example NavLinks (RouterNavLink usage) */}
          {/* <NavLink
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
          /> */}

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

        {/* <AppShell.Section p="sm">
          <Button component={RouterNavLink} to="/sign-out" variant="subtle">
            Sign Out
          </Button>
        </AppShell.Section> */}
      </AppShell.Navbar>

      {/* MAIN Content Area */}
      <AppShell.Main>
        <AudioRecorder />
        {/* If you have nested routes, they render here */}
        <Outlet />


      </AppShell.Main>
    </AppShell>
  );
}
