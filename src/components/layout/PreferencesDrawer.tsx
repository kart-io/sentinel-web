import React from 'react';
import { Drawer, Divider, Switch, Slider, Tooltip, Radio, Segmented, Button } from 'antd';
import { Check, RotateCcw, Moon, Sun, Monitor } from 'lucide-react';
import {
  useLayoutStore,
  themeColorPresets,
  type LayoutType,
  type ThemeMode,
  type TabsStyleType,
  type ThemeColorKey,
} from '@/store/layoutStore';

interface PreferencesDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 布局模式选择器
 */
const LayoutSelector: React.FC = () => {
  const layout = useLayoutStore((state) => state.app.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);

  const layouts: { type: LayoutType; label: string; icon: React.ReactNode }[] = [
    { type: 'sidebar-nav', label: '侧边菜单', icon: <LayoutIcon type="sidebar" /> },
    { type: 'header-nav', label: '顶部菜单', icon: <LayoutIcon type="header" /> },
    { type: 'mixed-nav', label: '混合菜单', icon: <LayoutIcon type="mixed" /> },
    { type: 'sidebar-mixed-nav', label: '侧边混合', icon: <LayoutIcon type="sidebar-mixed" /> },
    { type: 'header-sidebar-nav', label: '顶部侧边', icon: <LayoutIcon type="header-sidebar" /> },
    { type: 'full-content', label: '全屏内容', icon: <LayoutIcon type="full" /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {layouts.map((item) => (
        <Tooltip key={item.type} title={item.label}>
          <div
            onClick={() => setLayout(item.type)}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer border-2 transition-all
              ${layout === item.type
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }
            `}
          >
            {item.icon}
            {layout === item.type && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                <Check size={10} className="text-white" />
              </div>
            )}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

/**
 * 布局图标组件
 */
const LayoutIcon: React.FC<{ type: string }> = ({ type }) => {
  const baseClass = 'w-full h-12 rounded overflow-hidden flex';

  switch (type) {
    case 'sidebar':
      return (
        <div className={baseClass}>
          <div className="w-1/4 bg-gray-700 dark:bg-gray-600" />
          <div className="flex-1 flex flex-col">
            <div className="h-1/4 bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      );
    case 'header':
      return (
        <div className={`${baseClass} flex-col`}>
          <div className="h-1/4 bg-gray-700 dark:bg-gray-600" />
          <div className="flex-1 bg-gray-100 dark:bg-gray-800" />
        </div>
      );
    case 'mixed':
      return (
        <div className={`${baseClass} flex-col`}>
          <div className="h-1/4 bg-gray-700 dark:bg-gray-600" />
          <div className="flex-1 flex">
            <div className="w-1/4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      );
    case 'sidebar-mixed':
      return (
        <div className={baseClass}>
          <div className="w-1/6 bg-gray-700 dark:bg-gray-600" />
          <div className="w-1/4 bg-gray-300 dark:bg-gray-700" />
          <div className="flex-1 flex flex-col">
            <div className="h-1/4 bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      );
    case 'header-sidebar':
      return (
        <div className={`${baseClass} flex-col`}>
          <div className="h-1/5 bg-gray-700 dark:bg-gray-600 w-full" />
          <div className="flex-1 flex">
            <div className="w-1/4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      );
    case 'full':
      return (
        <div className={`${baseClass} flex-col`}>
          <div className="flex-1 bg-gray-100 dark:bg-gray-800" />
        </div>
      );
    default:
      return null;
  }
};

/**
 * 主题色选择器
 */
const ThemeColorSelector: React.FC = () => {
  const colorPrimary = useLayoutStore((state) => state.theme.colorPrimary);
  const setThemeColor = useLayoutStore((state) => state.setThemeColor);

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(themeColorPresets).map(([key, color]) => (
        <Tooltip key={key} title={key}>
          <div
            onClick={() => setThemeColor(color, key as ThemeColorKey)}
            className={`
              relative w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center transition-transform hover:scale-110
              ${colorPrimary === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
            `}
            style={{ backgroundColor: color }}
          >
            {colorPrimary === color && <Check size={14} className="text-white" />}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

/**
 * 主题模式选择器
 */
const ThemeModeSelector: React.FC = () => {
  const mode = useLayoutStore((state) => state.theme.mode);
  const updateTheme = useLayoutStore((state) => state.updateTheme);

  const modes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: '亮色', icon: <Sun size={16} /> },
    { value: 'dark', label: '暗色', icon: <Moon size={16} /> },
    { value: 'system', label: '跟随系统', icon: <Monitor size={16} /> },
  ];

  return (
    <Segmented
      value={mode}
      onChange={(value) => updateTheme({ mode: value as ThemeMode })}
      options={modes.map((m) => ({
        value: m.value,
        label: (
          <div className="flex items-center gap-1.5 px-1">
            {m.icon}
            <span>{m.label}</span>
          </div>
        ),
      }))}
      block
    />
  );
};

/**
 * 标签页样式选择器
 */
const TabsStyleSelector: React.FC = () => {
  const styleType = useLayoutStore((state) => state.tabbar.styleType);
  const updateTabbar = useLayoutStore((state) => state.updateTabbar);

  const styles: { value: TabsStyleType; label: string }[] = [
    { value: 'chrome', label: 'Chrome' },
    { value: 'card', label: '卡片' },
    { value: 'brisk', label: '简洁' },
    { value: 'plain', label: '朴素' },
  ];

  return (
    <Radio.Group
      value={styleType}
      onChange={(e) => updateTabbar({ styleType: e.target.value })}
      optionType="button"
      buttonStyle="solid"
      size="small"
    >
      {styles.map((s) => (
        <Radio.Button key={s.value} value={s.value}>
          {s.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

/**
 * 偏好设置抽屉组件
 */
const PreferencesDrawer: React.FC<PreferencesDrawerProps> = ({ open, onClose }) => {
  const {
    sidebar,
    header,
    tabbar,
    footer,
    breadcrumb,
    theme,
    navigation,
    updateSidebar,
    updateHeader,
    updateTabbar,
    updateTheme,
    toggleFooter,
    toggleBreadcrumb,
    toggleTabbar,
    resetPreferences,
  } = useLayoutStore();

  return (
    <Drawer
      title="偏好设置"
      placement="right"
      onClose={onClose}
      open={open}
      styles={{ wrapper: { width: 320 } }}
      footer={
        <Button
          onClick={resetPreferences}
          icon={<RotateCcw size={14} />}
          block
        >
          重置配置
        </Button>
      }
    >
      <div className="space-y-6">
        {/* 布局模式 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">布局模式</h3>
          <LayoutSelector />
        </section>

        <Divider />

        {/* 主题模式 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">主题模式</h3>
          <ThemeModeSelector />
        </section>

        {/* 主题色 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">主题色</h3>
          <ThemeColorSelector />
        </section>

        {/* 圆角 */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">圆角大小</span>
            <span className="text-xs text-gray-400">{theme.radius}px</span>
          </div>
          <Slider
            min={0}
            max={16}
            value={theme.radius}
            onChange={(value) => updateTheme({ radius: value })}
          />
        </section>

        <Divider />

        {/* 侧边栏设置 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">侧边栏</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">宽度</span>
              <span className="text-xs text-gray-400">{sidebar.width}px</span>
            </div>
            <Slider
              min={180}
              max={280}
              value={sidebar.width}
              onChange={(value) => updateSidebar({ width: value })}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">悬停展开</span>
              <Switch
                size="small"
                checked={sidebar.expandOnHover}
                onChange={(checked) => updateSidebar({ expandOnHover: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">深色侧边栏</span>
              <Switch
                size="small"
                checked={theme.semiDarkSidebar}
                onChange={(checked) => updateTheme({ semiDarkSidebar: checked })}
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* 顶栏设置 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">顶栏</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">固定模式</span>
              <Switch
                size="small"
                checked={header.mode === 'fixed'}
                onChange={(checked) => updateHeader({ mode: checked ? 'fixed' : 'static' })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">显示面包屑</span>
              <Switch
                size="small"
                checked={breadcrumb.enable}
                onChange={toggleBreadcrumb}
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* 标签页设置 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">标签页</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">显示标签页</span>
              <Switch
                size="small"
                checked={tabbar.enable}
                onChange={toggleTabbar}
              />
            </div>
            {tabbar.enable && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">标签页样式</span>
                </div>
                <TabsStyleSelector />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">显示图标</span>
                  <Switch
                    size="small"
                    checked={tabbar.showIcon}
                    onChange={(checked) => updateTabbar({ showIcon: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">持久化</span>
                  <Switch
                    size="small"
                    checked={tabbar.persist}
                    onChange={(checked) => updateTabbar({ persist: checked })}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        <Divider />

        {/* 页脚设置 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">页脚</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">显示页脚</span>
            <Switch
              size="small"
              checked={footer.enable}
              onChange={toggleFooter}
            />
          </div>
        </section>

        <Divider />

        {/* 导航设置 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">导航菜单</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">手风琴模式</span>
              <Switch
                size="small"
                checked={navigation.accordion}
                onChange={(checked) =>
                  useLayoutStore.setState((state) => ({
                    navigation: { ...state.navigation, accordion: checked },
                  }))
                }
              />
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
};

export default PreferencesDrawer;
