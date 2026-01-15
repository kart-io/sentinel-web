import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './router';
import { createMuiTheme } from './theme/muiTheme';
import { useLayoutStore } from './store/layoutStore';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MessageHolder } from './utils/messageHolder';
import { useMemo } from 'react';

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
  // 获取当前主题模式
  const themeMode = useLayoutStore((state) => state.theme.mode);

  // 根据系统主题和用户设置确定实际主题
  const isDark = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    // system 模式：跟随系统
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [themeMode]);

  // 动态创建 MUI 主题
  const muiTheme = useMemo(() => {
    return createMuiTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

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
