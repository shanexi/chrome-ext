# Chrome Extension Demo

一个简单的 Chrome 扩展示例项目，展示了基本的扩展功能。

## 功能特性

### Popup 功能
- **高亮文本**: 高亮当前页面的所有文本内容
- **元素统计**: 统计页面中各种HTML元素的数量  
- **背景颜色**: 随机改变页面背景色
- **清除效果**: 清除所有应用的效果
- **侧边栏**: 打开功能丰富的侧边栏面板

### Side Panel 功能 ⭐️ 新增
- **固定侧边栏**: Chrome 原生侧边栏支持（Chrome 114+）
- **页面工具集**: 完整的页面操作工具
- **页面美化开关**: 一键启用/关闭页面美化效果
- **实时页面信息**: 显示当前页面详细统计信息
- **跨标签页持久**: 侧边栏在标签页间保持打开状态

### Content Script 功能
- **浮动按钮**: 页面右上角显示工具按钮
- **页面效果**: 点击按钮激活/关闭页面美化效果
- **快捷键**: `Ctrl+Shift+D` 快速切换效果
- **通知提示**: 显示操作状态通知

## 安装步骤

1. **生成图标文件** (可选):
   - 在浏览器中打开 `create_icons.html`
   - 点击 "Download All Icons" 下载图标文件
   - 将下载的图标文件放到 `icons/` 目录下

2. **加载扩展**:
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目根目录

3. **使用扩展**:
   - 点击工具栏中的扩展图标打开 popup
   - 点击 "打开侧边栏面板" 启用侧边栏功能
   - 或者直接使用页面上的浮动按钮
   - 使用快捷键 `Ctrl+Shift+D` 快速操作

## 文件结构

```
chrome_ext/
├── manifest.json       # 扩展配置文件
├── popup.html         # 弹出页面HTML
├── popup.js           # 弹出页面逻辑
├── sidepanel.html     # 侧边栏页面HTML
├── sidepanel.js       # 侧边栏页面逻辑
├── content.js         # 内容脚本
├── create_icons.html  # 图标生成工具
├── icon_converter.html # 图标转换工具
├── generate_icons.py  # Python图标生成脚本
├── icons/             # 图标文件目录
│   ├── icon16.svg
│   ├── icon32.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md         # 说明文档
```

## 权限说明

- `activeTab`: 访问当前活动标签页
- `storage`: 存储扩展数据
- `sidePanel`: 侧边栏功能支持
- `<all_urls>`: Content script 可在所有网站运行

## 兼容性要求

- **Chrome 114+**: Side Panel 功能需要 Chrome 114 或更高版本
- **Manifest V3**: 使用最新的扩展清单版本
- **现代浏览器**: 支持现代 JavaScript 特性

## 开发说明

这是一个使用 Manifest V3 的现代 Chrome 扩展示例，包含了：

- **现代化的UI设计**: 精美的界面和交互效果
- **完整的错误处理**: 友好的错误提示和状态反馈
- **Side Panel 集成**: 展示最新的 Chrome 扩展API
- **多种交互方式**: Popup、侧边栏、Content Script
- **响应式布局**: 适配不同屏幕尺寸
- **无障碍设计**: 考虑用户体验和可访问性
- **SVG 图标支持**: 可缩放矢量图标

适合作为学习现代 Chrome 扩展开发的完整示例项目。