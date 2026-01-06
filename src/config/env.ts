/**
 * 环境配置模块
 */

export type Environment = 'development' | 'test' | 'staging' | 'production' | 'local';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 环境配置接口
 */
export interface EnvConfig {
  appTitle: string;
  appVersion: string;
  apiBaseUrl: string;
  apiTimeout: number;
  env: Environment;
  enableMock: boolean;
  enableDebug: boolean;
  logLevel: LogLevel;
  isDevelopment: boolean;
  isTest: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

/**
 * 解析布尔值环境变量
 */
function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * 解析数字环境变量
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 获取环境配置
 */
export function getEnvConfig(): EnvConfig {
  const env = (import.meta.env.VITE_APP_ENV || 'development') as Environment;

  return {
    appTitle: import.meta.env.VITE_APP_TITLE || 'Sentinel-X Web',
    appVersion: import.meta.env.VITE_APP_VERSION || '0.0.0',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    apiTimeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, 30000),
    env,
    enableMock: parseBoolean(import.meta.env.VITE_ENABLE_MOCK, false),
    enableDebug: parseBoolean(import.meta.env.VITE_ENABLE_DEBUG, false),
    logLevel: (import.meta.env.VITE_LOG_LEVEL || 'info') as LogLevel,
    isDevelopment: env === 'development',
    isTest: env === 'test',
    isStaging: env === 'staging',
    isProduction: env === 'production',
  };
}

/**
 * 默认导出环境配置
 */
const envConfig = getEnvConfig();

export default envConfig;

/**
 * 打印环境配置信息（仅在开发环境）
 */
if (envConfig.isDevelopment || envConfig.enableDebug) {
  console.log('🔧 Environment Config:', {
    env: envConfig.env,
    apiBaseUrl: envConfig.apiBaseUrl,
    enableMock: envConfig.enableMock,
    enableDebug: envConfig.enableDebug,
    logLevel: envConfig.logLevel,
  });
}
