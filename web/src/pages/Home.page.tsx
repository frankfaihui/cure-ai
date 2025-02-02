import {
  AppShell, Flex, Title
} from '@mantine/core';
import { Outlet } from 'react-router-dom';
import AudioRecorder from '@/components/AudioRecorder';

export default function HomePage() {

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Flex justify="space-between" align="center" sx={{ height: '100%' }} px="md">
          <Title order={3}>CuraAI</Title>
        </Flex>
      </AppShell.Header>

      <AppShell.Main>
        <AudioRecorder />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
