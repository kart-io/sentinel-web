import { Modal, Form } from 'antd';
import type { FormInstance, FormProps, ModalProps } from 'antd';
import type { ReactNode } from 'react';

/**
 * FormModal Props 接口
 */
export interface FormModalProps<T = Record<string, unknown>> extends Omit<ModalProps, 'onOk'> {
  /**
   * 弹窗标题
   */
  title: string;

  /**
   * 是否打开
   */
  open: boolean;

  /**
   * 关闭回调
   */
  onClose: () => void;

  /**
   * 确认按钮文本
   * @default '确定'
   */
  okText?: string;

  /**
   * 取消按钮文本
   * @default '取消'
   */
  cancelText?: string;

  /**
   * 提交中状态
   */
  loading?: boolean;

  /**
   * 表单实例
   */
  form?: FormInstance<T>;

  /**
   * 表单项配置（通过 children 传入）
   */
  children: ReactNode;

  /**
   * 提交回调
   */
  onSubmit?: (values: T) => void | Promise<void>;

  /**
   * 表单属性
   */
  formProps?: Omit<FormProps, 'form'>;

  /**
   * 是否显示取消按钮
   * @default true
   */
  showCancel?: boolean;

  /**
   * 确认按钮类型
   * @default 'primary'
   */
  okButtonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text';

  /**
   * 提交前验证
   * @default true
   */
  validateBeforeSubmit?: boolean;
}

/**
 * FormModal 组件
 *
 * @description 通用表单弹窗组件，集成 Ant Design Form 和 Modal
 *
 * @example
 * ```tsx
 * <FormModal
 *   title="创建用户"
 *   open={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onSubmit={handleSubmit}
 *   loading={loading}
 * >
 *   <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
 *     <Input placeholder="请输入用户名" />
 *   </Form.Item>
 * </FormModal>
 * ```
 */
export function FormModal<T = Record<string, unknown>>({
  title,
  open,
  onClose,
  okText = '确定',
  cancelText = '取消',
  loading = false,
  form: externalForm,
  children,
  onSubmit,
  formProps,
  showCancel = true,
  okButtonType = 'primary',
  validateBeforeSubmit = true,
  ...modalProps
}: FormModalProps<T>) {
  const [form] = Form.useForm<T>();
  const formInstance = externalForm || form;

  const handleOk = async () => {
    if (validateBeforeSubmit) {
      try {
        const values = await formInstance.validateFields();
        await onSubmit?.(values);
      } catch (error) {
        console.error('Form validation failed:', error);
      }
    } else {
      const values = formInstance.getFieldsValue();
      await onSubmit?.(values);
    }
  };

  const handleCancel = () => {
    formInstance.resetFields();
    onClose();
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ loading, type: okButtonType }}
      cancelButtonProps={{ style: showCancel ? undefined : { display: 'none' } }}
      destroyOnClose
      width={600}
      {...modalProps}
    >
      <Form<T>
        {...formProps}
        form={formInstance}
        layout="vertical"
      >
        {children}
      </Form>
    </Modal>
  );
}
