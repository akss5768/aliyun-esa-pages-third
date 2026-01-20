## 声明

本项目由阿里云ESA提供加速、计算和保护
![阿里云ESA](aliyun.png)


# U-Budget 个人财务管理

U-Budget 是一个简洁高效的财务管理应用，帮助您轻松追踪收入和支出，了解财务状况。

## 功能特性

- **收支记录** - 记录每笔收入和支出
- **分类统计** - 按类别查看财务数据
- **余额查询** - 实时计算账户余额
- **数据持久化** - 使用 LocalStorage 本地存储数据
- **响应式设计** - 完美适配桌面和移动设备
- **明亮清新** - 蓝色主题界面，清新舒适

## 技术栈

- **前端框架**: React 18
- **路由**: React Router
- **UI样式**: Tailwind CSS 3.4
- **状态管理**: React Hooks
- **数据存储**: LocalStorage
- **构建工具**: Vite
- **图标库**: Lucide React

## 安装和启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd U-Budget
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录中。

### 5. 预览生产构建

```bash
npm run preview
```

## 部署

### 部署到阿里云ESA

项目已配置为可在阿里云ESA平台部署，配置文件 `esa.jsonc` 定义了部署参数。

## 数据存储

本项目使用浏览器 localStorage 作为数据存储方案。

## 许可证

该项目遵循以下协议 [MIT license](https://opensource.org/licenses/MIT).
