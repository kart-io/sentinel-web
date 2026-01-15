import { createTheme, type Theme } from '@mui/material/styles';

/**
 * 创建 MUI 主题
 * @param mode - 主题模式 ('light' | 'dark')
 * @returns MUI Theme 对象
 */
export const createMuiTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme({
    palette: {
      mode, // 设置主题模式
      primary: {
        main: '#0960bd',
        light: '#40a9ff',
        dark: '#003a8c',
      },
      secondary: {
        main: '#52c41a',
        light: '#73d13d',
        dark: '#389e0d',
      },
      error: {
        main: '#ff4d4f',
      },
      warning: {
        main: '#faad14',
      },
      info: {
        main: '#0960bd',
      },
      success: {
        main: '#52c41a',
      },
      background: mode === 'dark'
        ? {
            default: '#0a0a0a',
            paper: '#1a1a1a',
          }
        : {
            default: '#f0f2f5',
            paper: '#ffffff',
          },
      text: mode === 'dark'
        ? {
            primary: 'rgba(255, 255, 255, 0.87)',
            secondary: 'rgba(255, 255, 255, 0.6)',
          }
        : {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
    },
    typography: {
      fontFamily: [
        "'Inter'",
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      fontSize: 14,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 6,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 6,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            boxShadow: mode === 'dark'
              ? '0 1px 2px 0 rgba(0, 0, 0, 0.5), 0 1px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
              : '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // 移除 MUI 默认的渐变背景
          },
          rounded: {
            borderRadius: 6,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'dark'
              ? '0 1px 2px 0 rgba(0, 0, 0, 0.5)'
              : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  });
};

// 默认亮色主题（保持向后兼容）
export const muiTheme = createMuiTheme('light');
