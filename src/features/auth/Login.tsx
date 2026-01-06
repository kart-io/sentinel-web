import { Form, Input, Button, message, Checkbox } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { TechBackground } from '@/components/common/TechBackground';

interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        id: '1',
        username: values.username,
        email: `${values.username}@example.com`,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + values.username,
        role: 'admin',
      };

      login(mockToken, mockUser);
      message.success('登录成功！');

      const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <TechBackground />

      {/* 左侧内容区 */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16">
        <div className="max-w-xl">
          {/* Logo 和标题 */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-white tracking-tight">
                  Sentinel<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">-X</span>
                </h1>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 leading-relaxed">
              下一代 AI 驱动的
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                DevOps 智能平台
              </span>
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed">
              集成人工智能、自动化运维与实时监控于一体，
              <br />
              为您的团队提供前所未有的开发运维体验
            </p>
          </div>

          {/* 特性列表 */}
          <div className="space-y-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'AI 智能监控',
                desc: '实时异常检测与智能告警'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: '自动化部署',
                desc: '一键发布，零停机更新'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: '数据可视化',
                desc: '多维度实时数据分析'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* 登录卡片 */}
          <div className="relative">
            {/* 背景光效 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur-2xl opacity-20"></div>

            {/* 卡片主体 */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
              {/* 移动端 Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900">
                    Sentinel<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">-X</span>
                  </h1>
                </div>
                <p className="text-gray-600">AI-Powered DevOps Platform</p>
              </div>

              {/* 表单标题 */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
                <p className="text-gray-600">登录以继续使用 Sentinel-X</p>
              </div>

              {/* 登录表单 */}
              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                requiredMark={false}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="用户名"
                    className="h-12 rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="密码"
                    className="h-12 rounded-xl"
                  />
                </Form.Item>

                <div className="flex items-center justify-between mb-6">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="text-sm text-gray-600">记住我</Checkbox>
                  </Form.Item>
                  <a href="#" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                    忘记密码？
                  </a>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="h-12 text-base font-semibold rounded-xl shadow-lg shadow-violet-500/30"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                      border: 'none',
                    }}
                  >
                    {loading ? '登录中...' : '登 录'}
                  </Button>
                </Form.Item>
              </Form>

              {/* 注册链接 */}
              <div className="text-center mt-6">
                <span className="text-gray-600 text-sm">还没有账户？</span>
                <a href="#" className="text-violet-600 hover:text-violet-700 font-medium text-sm ml-1">
                  立即注册
                </a>
              </div>

              {/* 测试提示 */}
              <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl border border-violet-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-violet-900 mb-1">测试账号</p>
                    <p className="text-xs text-violet-700">任意用户名和密码均可登录体验</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部版权 */}
          <p className="text-center mt-8 text-sm text-gray-400">
            © 2024 Sentinel-X. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
