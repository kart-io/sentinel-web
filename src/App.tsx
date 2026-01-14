import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './router';
import { muiTheme } from './theme/muiTheme';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MessageHolder } from './utils/messageHolder';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: '#0960bd',
                borderRadius: 2,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              },
              components: {
                 Button: {
                   borderRadius: 2,
                   controlHeight: 32,
                 },
                 Input: {
                   borderRadius: 2,
                 },
                 Card: {
                   borderRadius: 2,
                 }
              }
            }}
          >
            <AntdApp>
              <MessageHolder />
              <RouterProvider router={router} />
            </AntdApp>
          </ConfigProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
