import { Container, Typography, Paper, Box, Grid, Chip, Stack, Divider } from '@mui/material';
import {
  Settings,
  Code,
  CheckCircle,
  Info,
  Warning,
  BugReport,
} from '@mui/icons-material';
import envConfig from '@/config';

export default function EnvDemo() {
  const getEnvColor = () => {
    switch (envConfig.env) {
      case 'production':
        return 'error';
      case 'staging':
        return 'warning';
      case 'test':
        return 'info';
      case 'development':
      default:
        return 'success';
    }
  };

  const getLogLevelIcon = () => {
    switch (envConfig.logLevel) {
      case 'error':
        return <Warning color="error" />;
      case 'warn':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      case 'debug':
      default:
        return <BugReport color="success" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Settings fontSize="large" color="primary" />
          <Typography variant="h3" fontWeight="bold" color="primary">
            环境配置展示
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          当前应用的环境配置信息
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 应用信息 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Code color="primary" />
                <Typography variant="h6">应用信息</Typography>
              </Stack>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  应用名称
                </Typography>
                <Typography variant="h6">{envConfig.appTitle}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  版本号
                </Typography>
                <Typography variant="h6">{envConfig.appVersion}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  当前环境
                </Typography>
                <Chip
                  label={envConfig.env.toUpperCase()}
                  color={getEnvColor()}
                  size="medium"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* API 配置 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Settings color="primary" />
                <Typography variant="h6">API 配置</Typography>
              </Stack>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  API 基础 URL
                </Typography>
                <Typography
                  variant="body1"
                  fontFamily="monospace"
                  sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    wordBreak: 'break-all',
                  }}
                >
                  {envConfig.apiBaseUrl}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  超时时间
                </Typography>
                <Typography variant="h6">{envConfig.apiTimeout / 1000}s</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* 调试配置 */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BugReport color="primary" />
                <Typography variant="h6">调试配置</Typography>
              </Stack>
              <Divider />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Mock 数据
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                      <CheckCircle
                        color={envConfig.enableMock ? 'success' : 'disabled'}
                        fontSize="small"
                      />
                      <Typography variant="h6">
                        {envConfig.enableMock ? '启用' : '禁用'}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      调试模式
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                      <CheckCircle
                        color={envConfig.enableDebug ? 'success' : 'disabled'}
                        fontSize="small"
                      />
                      <Typography variant="h6">
                        {envConfig.enableDebug ? '启用' : '禁用'}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      日志级别
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                      {getLogLevelIcon()}
                      <Typography variant="h6">{envConfig.logLevel.toUpperCase()}</Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      环境状态
                    </Typography>
                    <Stack spacing={0.5}>
                      {envConfig.isDevelopment && (
                        <Chip label="开发环境" size="small" color="success" />
                      )}
                      {envConfig.isTest && <Chip label="测试环境" size="small" color="info" />}
                      {envConfig.isStaging && (
                        <Chip label="预发布环境" size="small" color="warning" />
                      )}
                      {envConfig.isProduction && (
                        <Chip label="生产环境" size="small" color="error" />
                      )}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        {/* 环境变量原始数据 */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              环境变量（import.meta.env）
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: 'grey.900',
                color: 'grey.100',
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(import.meta.env, null, 2)}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
