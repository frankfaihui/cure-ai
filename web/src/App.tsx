import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import {
  emotionTransform,
  MantineEmotionProvider,
} from '@mantine/emotion';
import { Router } from './Router';
import { theme } from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export default function App() {
  return (
    <MantineProvider theme={theme} stylesTransform={emotionTransform}>
      <MantineEmotionProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </MantineEmotionProvider>
    </MantineProvider>
  );
}
