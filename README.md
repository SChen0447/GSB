# 灵犀看板 · 智能任务拖拽工作台

一个现代化、响应式的个人任务看板 Web 应用，支持拖拽任务管理、主题切换、数据导出等功能。

## ✨ 功能特性

- 🎯 **三列看板布局**: 待处理、进行中、已完成
- 🎨 **拖拽功能**: 支持跨列拖拽任务卡片，流畅的视觉反馈
- 📝 **任务管理**: 添加、编辑、删除任务，完整的表单验证
- 🎭 **暗色/亮色主题**: 平滑切换，自动保存偏好
- 🔍 **实时搜索**: 按标题动态过滤任务
- 📊 **数据统计**: 总任务数、各状态数量、高优先级任务统计
- 💾 **本地存储**: 所有数据自动保存到 localStorage
- 📤 **JSON 导出**: 一键导出所有任务数据
- 📱 **响应式设计**: 完美适配桌面和移动端

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS
- **状态管理**: Zustand
- **拖拽库**: @dnd-kit
- **日期处理**: dayjs
- **图标**: lucide-react

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将运行在 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/
│   ├── Board.tsx       # 看板主容器
│   ├── Column.tsx      # 看板列组件
│   ├── TaskCard.tsx    # 任务卡片组件
│   ├── TaskForm.tsx    # 添加/编辑任务表单
│   ├── StatsPanel.tsx  # 统计面板组件
│   ├── Header.tsx      # 顶部导航栏
│   └── Modal.tsx       # 模态框组件
├── store/
│   └── useTaskStore.ts # Zustand 状态管理
├── types/
│   └── index.ts        # TypeScript 类型定义
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## ✅ 浏览器兼容性

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

> 💡 移动端宽度 < 640px 时自动禁用拖拽功能并给出提示

## 📋 注意事项

- 截止日期不能早于当天，过期日期会标红显示
- 删除任务前需要确认，防止误删
- 所有用户变更自动保存到本地存储
- 主题偏好自动记忆
