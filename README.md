# Chrome Extension Demo

一个简单的 Chrome 扩展示例项目，展示了基本的扩展功能。

## 功能特性

### Popup 功能
- **高亮文本**: 高亮当前页面的所有文本内容
- **元素统计**: 统计页面中各种HTML元素的数量  
- **背景颜色**: 随机改变页面背景色
- **清除效果**: 清除所有应用的效果

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
   - 或者直接使用页面上的浮动按钮
   - 使用快捷键 `Ctrl+Shift+D` 快速操作

## 文件结构

```
chrome_ext/
├── manifest.json       # 扩展配置文件
├── popup.html         # 弹出页面HTML
├── popup.js           # 弹出页面逻辑
├── content.js         # 内容脚本
├── create_icons.html  # 图标生成工具
├── icons/             # 图标文件目录
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md         # 说明文档
```

## 权限说明

- `activeTab`: 访问当前活动标签页
- `storage`: 存储扩展数据
- `<all_urls>`: Content script 可在所有网站运行

## 开发说明

这是一个使用 Manifest V3 的现代 Chrome 扩展示例，包含了：

- 现代化的UI设计
- 完整的错误处理
- 用户友好的交互反馈
- 响应式布局
- 无障碍设计考虑

适合作为学习 Chrome 扩展开发的起点项目。