/**
 * ErrorBoundary 错误边界组件
 * 用于捕获并处理子组件中的运行时错误
 * 集成 Sentry 自动上报错误
 */

import { Component, type ReactNode } from 'react';
import { Result, Button } from 'antd';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  eventId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 上报错误到 Sentry
    Sentry.withScope((scope) => {
      scope.setContext('errorBoundary', {
        componentStack: errorInfo.componentStack,
      });

      const eventId = Sentry.captureException(error);

      this.setState({
        error,
        errorInfo,
        eventId,
      });
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, eventId: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReportFeedback = () => {
    // 打开 Sentry 用户反馈对话框
    if (this.state.eventId) {
      Sentry.showReportDialog({
        eventId: this.state.eventId,
        lang: 'zh-CN',
        title: '发生了一个错误',
        subtitle: '我们的团队已收到通知。如果您愿意，请告诉我们发生了什么。',
        subtitle2: '这将帮助我们更快地解决问题。',
        labelName: '姓名',
        labelEmail: '邮箱',
        labelComments: '发生了什么？',
        labelClose: '关闭',
        labelSubmit: '提交',
        errorGeneric: '提交反馈时发生未知错误。请重试。',
        errorFormEntry: '某些字段无效。请修正错误并重试。',
        successMessage: '您的反馈已发送。谢谢！',
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-2xl w-full">
            <Result
              status="error"
              title="页面出错了"
              subTitle="抱歉，页面运行时发生了错误。您可以尝试刷新页面或返回首页。我们已经记录了这个问题，将尽快修复。"
              extra={[
                <Button type="primary" key="reload" onClick={this.handleReload}>
                  刷新页面
                </Button>,
                <Button key="reset" onClick={this.handleReset}>
                  重试
                </Button>,
                <Button key="home" onClick={() => (window.location.href = '/')}>
                  返回首页
                </Button>,
                this.state.eventId && (
                  <Button key="feedback" onClick={this.handleReportFeedback}>
                    反馈问题
                  </Button>
                ),
              ]}
            >
              {/* 开发环境显示错误详情 */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mt-6 text-left">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold mb-2">错误详情:</h3>
                    <pre className="text-sm text-red-700 overflow-auto max-h-64">
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                    {this.state.eventId && (
                      <p className="text-xs text-red-600 mt-2">
                        Sentry Event ID: {this.state.eventId}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Result>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 导出带 Sentry 高阶组件包装的 ErrorBoundary
const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: ({ error, resetError }: { error: unknown; resetError: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full">
        <Result
          status="error"
          title="应用程序错误"
          subTitle={(error as Error)?.message || '发生了未知错误'}
          extra={[
            <Button type="primary" key="reset" onClick={resetError}>
              重试
            </Button>,
            <Button key="home" onClick={() => (window.location.href = '/')}>
              返回首页
            </Button>,
          ]}
        />
      </div>
    </div>
  ),
  showDialog: false, // 可以设置为 true 自动显示反馈对话框
});

export default SentryErrorBoundary;
