import { Form, Input, Button, Card } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface LoginFormValues {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: LoginFormValues) => {
    console.log('Login values:', values);
    // TODO: 实现实际的登录逻辑
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sentinel-X
          </h1>
          <p className="text-gray-500">企业级智能管理平台</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密码"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                忘记密码?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 rounded-lg text-base font-medium"
            >
              登录
            </Button>
          </Form.Item>

          <div className="text-center text-sm text-gray-500">
            还没有账户?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              立即注册
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
