import React, { useState } from 'react';
import { Drawer, Divider, Switch, Slider, Tooltip, Radio, Segmented, Button, Tabs } from 'antd';
import { Check, RotateCcw, Moon, Sun, Monitor, Palette, Layout, Settings as SettingsIcon } from 'lucide-react';
import {
  useLayoutStore,
  themeColorPresets,
  type ThemeMode,
  type TabsStyleType,
  type ThemeColorKey,
} from '@/store/layoutStore';
import LayoutSelector from './LayoutSelector';
import ContentWidthSelector from './ContentWidthSelector';

interface PreferencesDrawerProps {
  open: boolean;
  onClose: () => void;
}

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

  const [activeTab, setActiveTab] = useState('appearance');

  const tabItems = [
    {
      key: 'appearance',
      label: (
        <div className="flex items-center gap-1.5">
          <Palette size={14} />
          <span>外观</span>
        </div>
      ),
      children: (
        <div className="space-y-6">
          {/* 主题模式 */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">主题模式</h3>
            <ThemeModeSelector />
          </section>

          {/* 主题色 */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">主题色</h3>
            <ThemeColorSelector />
          </section>

          <Divider className="my-4" />

          {/* 圆角 */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">圆角大小</span>
              <span className="text-xs text-muted-foreground/60">{theme.radius}px</span>
            </div>
            <Slider
              min={0}
              max={16}
              value={theme.radius}
              onChange={(value) => updateTheme({ radius: value })}
            />
          </section>

          {/* 字体大小 */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">字体大小</span>
              <span className="text-xs text-muted-foreground/60">{theme.fontSize}px</span>
            </div>
            <Slider
              min={12}
              max={18}
              value={theme.fontSize}
              onChange={(value) => updateTheme({ fontSize: value })}
            />
          </section>

          <Divider className="my-4" />

          {/* 深色侧边栏 */}
          <section>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">深色侧边栏</span>
              <Switch
                size="small"
                checked={theme.semiDarkSidebar}
                onChange={(checked) => updateTheme({ semiDarkSidebar: checked })}
              />
            </div>
          </section>
        </div>
      ),
    },
    {
      key: 'layout',
      label: (
        <div className="flex items-center gap-1.5">
          <Layout size={14} />
          <span>布局</span>
        </div>
      ),
      children: (
        <div className="space-y-6">
          {/* 布局模式选择 */}
          <LayoutSelector />

          <Divider className="my-4" />

          {/* 内容宽度选择 */}
          <ContentWidthSelector />

          <Divider className="my-4" />

          {/* 侧边栏设置 */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">侧边栏</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">宽度</span>
                  <span className="text-xs text-muted-foreground/60">{sidebar.width}px</span>
                </div>
                <Slider
                  min={180}
                  max={280}
                  value={sidebar.width}
                  onChange={(value) => updateSidebar({ width: value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">悬停展开</span>
                <Switch
                  size="small"
                  checked={sidebar.expandOnHover}
                  onChange={(checked) => updateSidebar({ expandOnHover: checked })}
                />
              </div>
            </div>
          </section>

          <Divider className="my-4" />

          {/* 顶栏设置 */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">顶栏</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">固定模式</span>
                <Switch
                  size="small"
                  checked={header.mode === 'fixed'}
                  onChange={(checked) => updateHeader({ mode: checked ? 'fixed' : 'static' })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">显示面包屑</span>
                <Switch
                  size="small"
                  checked={breadcrumb.enable}
                  onChange={toggleBreadcrumb}
                />
              </div>
            </div>
          </section>

          <Divider className="my-4" />

          {/* 标签页设置 */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">标签页</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">显示标签页</span>
                <Switch
                  size="small"
                  checked={tabbar.enable}
                  onChange={toggleTabbar}
                />
              </div>
              {tabbar.enable && (
                <>
                  <div>
                    <div className="mb-2">
                      <span className="text-sm text-muted-foreground">标签页样式</span>
                    </div>
                    <TabsStyleSelector />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">显示图标</span>
                    <Switch
                      size="small"
                      checked={tabbar.showIcon}
                      onChange={(checked) => updateTabbar({ showIcon: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">持久化</span>
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

          <Divider className="my-4" />

          {/* 页脚设置 */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">页脚</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">显示页脚</span>
              <Switch
                size="small"
                checked={footer.enable}
                onChange={toggleFooter}
              />
            </div>
          </section>
        </div>
      ),
    },
    {
      key: 'navigation',
      label: (
        <div className="flex items-center gap-1.5">
          <SettingsIcon size={14} />
          <span>导航</span>
        </div>
      ),
      children: (
        <div className="space-y-6">
          {/* 导航设置 */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">导航菜单</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">手风琴模式</div>
                  <div className="text-xs text-muted-foreground/60 mt-0.5">展开一个菜单时自动折叠其他菜单</div>
                </div>
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
      ),
    },
  ];

  return (
    <Drawer
      title="偏好设置"
      placement="right"
      onClose={onClose}
      open={open}
      width={360}
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
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="preferences-tabs"
      />
    </Drawer>
  );
};

export default PreferencesDrawer;
