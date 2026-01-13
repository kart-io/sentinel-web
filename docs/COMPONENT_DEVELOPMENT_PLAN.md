# Sentinel-X Web 组件开发规划

> 更新时间: 2026-01-13
> 版本: 1.0.0

---

## 📊 当前状态分析

### 已实现模块

#### 1. 通用组件 (src/components/)
- ✅ `ErrorBoundary` - 错误边界组件
- ✅ `TechBackground` - 技术背景动画
- ✅ `ProtectedRoute` - 路由保护组件
- ✅ `DataTable` - Material UI 表格组件

#### 2. 功能模块
- ✅ **Auth 模块** - 登录页面完整实现
- ✅ **RAG 模块** - 完整的知识库、文档、查询功能
- ✅ **Dashboard** - 基础仪表板
- ⚠️ **User Center** - 占位页面（未开发）
- ⚠️ **Scheduler** - 占位页面（未开发）
- ⚠️ **Settings** - 占位页面（未开发）

---

## 🎯 组件开发规划

### Phase 1: 基础共享组件库 (Priority: 🔥 High)

#### 1.1 数据展示组件

| 组件名称 | 文件路径 | 功能描述 | 依赖 |
|---------|---------|---------|------|
| **StatCard** | `src/components/ui/StatCard.tsx` | 统计卡片，支持趋势指示 | `lucide-react` |
| **EmptyState** | `src/components/ui/EmptyState.tsx` | 空状态提示，支持自定义图标和操作 | `lucide-react` |
| **Loading** | `src/components/ui/Loading.tsx` | 加载状态，支持骨架屏和旋转图标 | `lucide-react` |
| **BadgeList** | `src/components/ui/BadgeList.tsx` | 标签列表，支持颜色和删除 | `antd` |
| **ProgressCard** | `src/components/ui/ProgressCard.tsx` | 进度卡片，带描述和百分比 | `lucide-react` |

#### 1.2 表单组件

| 组件名称 | 文件路径 | 功能描述 | 依赖 |
|---------|---------|---------|------|
| **FormModal** | `src/components/form/FormModal.tsx` | 通用表单弹窗，支持动态表单配置 | `antd` |
| **SearchBar** | `src/components/form/SearchBar.tsx` | 搜索栏，支持高级搜索展开 | `lucide-react` |
| **FilterPanel** | `src/components/form/FilterPanel.tsx` | 过滤面板，多条件组合 | `antd` |
| **FormActions** | `src/components/form/FormActions.tsx` | 表单操作按钮组 | `antd` |

#### 1.3 反馈组件

| 组件名称 | 文件路径 | 功能描述 | 依赖 |
|---------|---------|---------|------|
| **ConfirmDialog** | `src/components/feedback/ConfirmDialog.tsx` | 确认对话框，支持自定义内容 | `antd` Modal |
| **ActionMenu** | `src/components/feedback/ActionMenu.tsx` | 操作菜单，支持下拉和右键菜单 | `antd` Dropdown |
| **Toast** | `src/components/feedback/Toast.tsx` | 消息提示封装，统一样式 | `antd` message |
| **NotificationPanel** | `src/components/feedback/NotificationPanel.tsx` | 通知面板，支持消息列表 | `lucide-react` |

#### 1.4 布局组件

| 组件名称 | 文件路径 | 功能描述 | 依赖 |
|---------|---------|---------|------|
| **PageHeader** | `src/components/layout/PageHeader.tsx` | 页面头部，支持面包屑和操作按钮 | `lucide-react` |
| **ContentCard** | `src/components/layout/ContentCard.tsx` | 内容卡片，统一样式 | - |
| **TabContainer** | `src/components/layout/TabContainer.tsx` | 标签页容器，支持懒加载 | `antd` |

#### 1.5 业务通用组件

| 组件名称 | 文件路径 | 功能描述 | 依赖 |
|---------|---------|---------|------|
| **UserAvatar** | `src/components/business/UserAvatar.tsx` | 用户头像，支持在线状态 | `antd` Avatar |
| **StatusBadge** | `src/components/business/StatusBadge.tsx` | 状态徽章，多种预设 | `antd` Tag |
| **DateTimePicker** | `src/components/business/DateTimePicker.tsx` | 日期时间选择器，范围选择 | `antd` |
| **FileUploader** | `src/components/business/FileUploader.tsx` | 文件上传组件，支持拖拽 | `antd` Upload |

---

### Phase 2: User Center 模块组件 (Priority: 🔥 High)

#### 2.1 用户管理

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **UserList** | `src/features/user-center/UserList.tsx` | 用户列表，搜索、筛选、批量操作 | ⬜ 未开发 |
| **UserForm** | `src/features/user-center/UserForm.tsx` | 用户表单（新增/编辑） | ⬜ 未开发 |
| **UserDetail** | `src/features/user-center/UserDetail.tsx` | 用户详情，权限分配 | ⬜ 未开发 |
| **PasswordChangeModal** | `src/features/user-center/PasswordChangeModal.tsx` | 密码修改弹窗 | ⬜ 未开发 |

#### 2.2 角色管理

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **RoleList** | `src/features/user-center/RoleList.tsx` | 角色列表，权限配置 | ⬜ 未开发 |
| **RoleForm** | `src/features/user-center/RoleForm.tsx` | 角色表单，权限勾选 | ⬜ 未开发 |
| **PermissionTree** | `src/features/user-center/PermissionTree.tsx` | 权限树，支持勾选和搜索 | ⬜ 未开发 |

#### 2.3 组织架构

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **OrganizationTree** | `src/features/user-center/OrganizationTree.tsx` | 组织树，拖拽排序 | ⬜ 未开发 |
| **DepartmentList** | `src/features/user-center/DepartmentList.tsx` | 部门列表，成员管理 | ⬜ 未开发 |
| **DepartmentForm** | `src/features/user-center/DepartmentForm.tsx` | 部门表单 | ⬜ 未开发 |

#### 2.4 个人资料

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **ProfileView** | `src/features/user-center/ProfileView.tsx` | 个人资料展示 | ⬜ 未开发 |
| **ProfileEdit** | `src/features/user-center/ProfileEdit.tsx` | 个人资料编辑 | ⬜ 未开发 |

---

### Phase 3: Scheduler 模块组件 (Priority: 🟡 Medium)

#### 3.1 任务管理

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **TaskList** | `src/features/scheduler/TaskList.tsx` | 任务列表，状态筛选、时间轴 | ⬜ 未开发 |
| **TaskForm** | `src/features/scheduler/TaskForm.tsx` | 任务表单，Cron 表达式 | ⬜ 未开发 |
| **TaskDetail** | `src/features/scheduler/TaskDetail.tsx` | 任务详情，执行历史 | ⬜ 未开发 |
| **CronEditor** | `src/features/scheduler/CronEditor.tsx` | Cron 表达式编辑器 | ⬜ 未开发 |

#### 3.2 调度规则

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **RuleList** | `src/features/scheduler/RuleList.tsx` | 规则列表，优先级配置 | ⬜ 未开发 |
| **RuleForm** | `src/features/scheduler/RuleForm.tsx` | 规则表单，条件配置 | ⬜ 未开发 |
| **WorkflowBuilder** | `src/features/scheduler/WorkflowBuilder.tsx` | 工作流构建器，拖拽连接 | ⬜ 未开发 |

#### 3.3 执行监控

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **ExecutionMonitor** | `src/features/scheduler/ExecutionMonitor.tsx` | 执行监控，实时状态 | ⬜ 未开发 |
| **LogViewer** | `src/features/scheduler/LogViewer.tsx` | 日志查看器，语法高亮 | ⬜ 未开发 |
| **MetricsChart** | `src/features/scheduler/MetricsChart.tsx` | 指标图表，性能分析 | ⬜ 未开发 |

---

### Phase 4: Settings 模块组件 (Priority: 🟡 Medium)

#### 4.1 系统设置

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **SystemSettings** | `src/features/settings/SystemSettings.tsx` | 系统设置，通用配置 | ⬜ 未开发 |
| **SecuritySettings** | `src/features/settings/SecuritySettings.tsx` | 安全设置，密码策略 | ⬜ 未开发 |
| **NotificationSettings** | `src/features/settings/NotificationSettings.tsx` | 通知设置，渠道配置 | ⬜ 未开发 |

#### 4.2 集成配置

| 组件名称 | 文件路径 | 功能描述 | 状态 |
|---------|---------|---------|------|
| **APIConfig** | `src/features/settings/APIConfig.tsx` | API 配置，密钥管理 | ⬜ 未开发 |
| **WebhookConfig** | `src/features/settings/WebhookConfig.tsx` | Webhook 配置 | ⬜ 未开发 |
| **StorageConfig** | `src/features/settings/StorageConfig.tsx` | 存储配置，OSS | ⬜ 未开发 |

---

## 📅 开发计划

### Sprint 1 (Week 1-2): 基础组件库

#### Week 1: 数据展示和表单组件
- [ ] **Day 1-2**: `StatCard`, `EmptyState`, `Loading`
- [ ] **Day 3-4**: `FormModal`, `SearchBar`, `FilterPanel`
- [ ] **Day 5**: `BadgeList`, `ProgressCard`, `FormActions`

#### Week 2: 反馈、布局和业务组件
- [ ] **Day 1-2**: `ConfirmDialog`, `ActionMenu`, `Toast`
- [ ] **Day 3-4**: `PageHeader`, `ContentCard`, `TabContainer`
- [ ] **Day 5**: `UserAvatar`, `StatusBadge`, `DateTimePicker`, `FileUploader`

**验收标准:**
- 所有组件支持 TypeScript 类型
- 组件文档完整（使用 Storybook 或内联注释）
- 单元测试覆盖率 > 80%
- 与 Ant Design 主题统一

---

### Sprint 2 (Week 3-4): User Center 模块

#### Week 3: 用户和角色管理
- [ ] **Day 1-2**: `UserList`, `UserForm`
- [ ] **Day 3-4**: `UserDetail`, `PasswordChangeModal`
- [ ] **Day 5**: `RoleList`, `RoleForm`

#### Week 4: 组织架构和个人资料
- [ ] **Day 1-2**: `PermissionTree`, `OrganizationTree`
- [ ] **Day 3-4**: `DepartmentList`, `DepartmentForm`
- [ ] **Day 5**: `ProfileView`, `ProfileEdit`

**验收标准:**
- 完整的用户 CRUD 操作
- RBAC 权限控制生效
- 组织树支持拖拽
- 所有表单验证完整

---

### Sprint 3 (Week 5-6): Scheduler 模块

#### Week 5: 任务管理
- [ ] **Day 1-2**: `TaskList`, `TaskForm`
- [ ] **Day 3-4**: `CronEditor`, `TaskDetail`
- [ ] **Day 5**: 集成测试和优化

#### Week 6: 调度规则和监控
- [ ] **Day 1-2**: `RuleList`, `RuleForm`
- [ ] **Day 3-4**: `ExecutionMonitor`, `LogViewer`
- [ ] **Day 5**: `WorkflowBuilder`, `MetricsChart`

**验收标准:**
- Cron 表达式解析正确
- 任务调度模拟正常
- 日志实时更新
- 性能图表可读性强

---

### Sprint 4 (Week 7-8): Settings 模块和优化

#### Week 7: 系统设置
- [ ] **Day 1-2**: `SystemSettings`, `SecuritySettings`
- [ ] **Day 3-4**: `NotificationSettings`, `APIConfig`
- [ ] **Day 5**: `WebhookConfig`, `StorageConfig`

#### Week 8: 整体优化和文档
- [ ] **Day 1-2**: 全局优化，性能调优
- [ ] **Day 3-4**: 补充组件文档，编写使用指南
- [ ] **Day 5**: 最终测试和验收

**验收标准:**
- 所有设置项可配置
- 配置持久化正常
- 完整的 API 文档
- 部署文档完善

---

## 🎨 组件设计规范

### 命名规范

| 类型 | 规范 | 示例 |
|-----|------|------|
| 组件文件 | PascalCase | `UserList.tsx` |
| 组件名称 | PascalCase | `export function UserList` |
| Props 接口 | PascalCase + Props | `interface UserListProps` |
| 事件处理 | handle + 动作 | `handleDelete`, `handleSubmit` |
| 状态变量 | 动作/名词 | `loading`, `selectedUser` |

### 文件结构

```
src/components/
├── ui/                    # 基础 UI 组件
│   ├── StatCard.tsx
│   ├── EmptyState.tsx
│   └── index.ts
├── form/                  # 表单相关组件
│   ├── FormModal.tsx
│   ├── SearchBar.tsx
│   └── index.ts
├── feedback/              # 反馈组件
│   ├── ConfirmDialog.tsx
│   └── index.ts
├── layout/                # 布局组件
│   ├── PageHeader.tsx
│   └── index.ts
├── business/              # 业务组件
│   ├── UserAvatar.tsx
│   └── index.ts
└── index.ts               # 统一导出
```

### 组件 Props 设计

```typescript
interface ComponentProps {
  // 必填项
  data: DataType;

  // 可选项
  disabled?: boolean;
  loading?: boolean;

  // 事件
  onChange?: (value: string) => void;
  onSubmit?: () => void;

  // 样式
  className?: string;
  style?: React.CSSProperties;

  // 子元素
  children?: React.ReactNode;
}
```

### 注释规范

```typescript
/**
 * 用户列表组件
 *
 * @description 展示系统用户列表，支持搜索、筛选、分页和批量操作
 *
 * @example
 * ```tsx
 * <UserList
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onCreate={handleCreate}
 * />
 * ```
 */
export function UserList({ onEdit, onDelete, onCreate }: UserListProps) {
  // ...
}
```

---

## 🧪 测试策略

### 单元测试

- 使用 Vitest + React Testing Library
- 每个组件编写测试用例
- 覆盖率目标: > 80%

### 集成测试

- 关键业务流程端到端测试
- 使用 Playwright
- 核心路径覆盖

### 手动测试清单

- [ ] 组件在所有视窗尺寸下正常显示
- [ ] 表单验证逻辑正确
- [ ] 加载状态显示正常
- [ ] 错误提示友好
- [ ] 无控制台错误

---

## 📚 文档要求

### 组件文档包含

1. **概述**: 组件用途和场景
2. **API 文档**: Props 说明和类型
3. **使用示例**: 代码示例
4. **最佳实践**: 推荐用法
5. **注意事项**: 常见问题

### 文档位置

- 内联 JSDoc 注释（组件代码中）
- Storybook 示例（可选）
- docs/ 目录下的 Markdown 文档

---

## 🚀 优先级说明

| 优先级 | 标志 | 说明 |
|-------|------|------|
| P0 | 🔥 | 核心功能，必须优先开发 |
| P1 | ⭐ | 重要功能，尽快开发 |
| P2 | 🟡 | 次要功能，按需开发 |
| P3 | ⬜ | 可选功能，后期优化 |

---

## ✅ 验收标准

### 代码质量
- [ ] TypeScript 无类型错误
- [ ] ESLint 检查通过
- [ ] 代码符合 Prettier 格式
- [ ] 无 TODO 标记（除非已记录）

### 功能完整性
- [ ] 所有需求功能已实现
- [ ] 边界情况已处理
- [ ] 错误处理完善
- [ ] 加载状态覆盖

### 用户体验
- [ ] 操作反馈及时
- [ ] 错误提示友好
- [ ] 页面响应迅速
- [ ] 移动端适配良好

### 测试覆盖
- [ ] 单元测试覆盖率 > 80%
- [ ] 核心流程集成测试通过
- [ ] 手动测试无严重问题

---

## 📞 沟通协作

### 每日站会
- 昨日完成
- 今日计划
- 遇到的问题

### 代码审查
- 所有代码合并前需 Code Review
- 至少一人审批通过
- 审查关注点: 类型安全、代码规范、性能

### 问题跟踪
- 使用 GitHub Issues 跟踪问题和需求
- 标签分类: bug, feature, enhancement, documentation
- 优先级设置和负责人分配

---

## 📌 附录

### 参考资源
- [Ant Design 组件库](https://ant.design/components/overview-cn/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Material UI Components](https://mui.com/components/)

### 快速命令

```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建生产版本
npm run build
```

---

**文档版本**: 1.0.0
**最后更新**: 2026-01-13
**维护者**: Sentinel-X 开发团队
