# npm问题诊断指南

## 🚨 常见错误及解决方案

### 1. rollup平台兼容性错误
```
Error: Cannot find module @rollup/rollup-darwin-x64
Error: Cannot find module @rollup/rollup-win32-x64
Error: Cannot find module @rollup/rollup-linux-x64
```

**原因**: rollup包含平台特定的二进制文件，跨平台使用时不兼容

**解决**: 终极修复脚本会自动清理并重新安装适合当前平台的依赖

### 2. npm代理配置错误
```
TypeError [ERR_INVALID_URL]: Invalid URL
192 verbose stack at new URL (node:internal/url:676:13)
```

**原因**: npm代理配置格式错误或包含无效字符

**解决**: 脚本会自动清理所有代理配置
```bash
npm config delete proxy
npm config delete https-proxy
npm config delete http-proxy
```

### 3. 网络连接超时
```
npm ERR! network request failed
npm ERR! network timeout
```

**原因**: 网络不稳定或DNS解析问题

**解决**: 脚本会尝试多个镜像源
- 官方源: https://registry.npmjs.org/
- 淘宝镜像: https://registry.npmmirror.com/

### 4. 依赖冲突错误
```
npm ERR! peer dep missing
npm ERR! ERESOLVE unable to resolve dependency tree
```

**原因**: 包版本冲突或peer依赖缺失

**解决**: 使用 `--legacy-peer-deps` 参数绕过严格检查

### 5. 缓存损坏
```
npm ERR! Unexpected end of JSON input
npm ERR! Invalid response body
```

**原因**: npm缓存文件损坏

**解决**: 清理缓存
```bash
npm cache clean --force
rm -rf ~/.npm
```

## 🔧 手动修复步骤

如果自动修复失败，请按顺序尝试：

### 步骤1: 完全重置npm配置
```bash
# 查看当前配置
npm config list

# 删除所有自定义配置
npm config delete proxy
npm config delete https-proxy
npm config delete http-proxy
npm config delete registry

# 或者编辑配置文件
npm config edit
# 删除所有内容，保存退出
```

### 步骤2: 清理缓存和依赖
```bash
# 清理npm缓存
npm cache clean --force

# 删除项目依赖
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# 清理全局缓存目录
rm -rf ~/.npm
```

### 步骤3: 重新配置npm
```bash
# 设置官方源
npm config set registry https://registry.npmjs.org/

# 或使用淘宝镜像
npm config set registry https://registry.npmmirror.com/

# 优化网络配置
npm config set fetch-retries 3
npm config set fetch-retry-factor 10
npm config set fetch-retry-mintimeout 10000
npm config set fetch-retry-maxtimeout 60000
```

### 步骤4: 重新安装依赖
```bash
# 使用legacy模式安装
npm install --legacy-peer-deps

# 如果仍失败，尝试分步安装
npm install react react-dom --legacy-peer-deps
npm install vite @vitejs/plugin-react --legacy-peer-deps
npm install --legacy-peer-deps
```

## 🌐 网络环境优化

### 企业网络环境
```bash
# 如果公司有代理服务器
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 设置代理认证
npm config set proxy http://username:password@proxy.company.com:8080
```

### 家庭网络环境
```bash
# 使用DNS优化
npm config set registry https://registry.npmmirror.com/

# 或使用cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com/
cnpm install
```

## 🔍 诊断命令

### 检查npm配置
```bash
npm config list
npm config get registry
npm config get proxy
```

### 检查网络连接
```bash
ping registry.npmjs.org
ping registry.npmmirror.com
curl -I https://registry.npmjs.org/
```

### 检查Node.js环境
```bash
node --version
npm --version
which node
which npm
```

## 🆘 最后手段

如果所有方法都失败：

### 1. 重新安装Node.js
- 完全卸载Node.js
- 从官网下载最新LTS版本
- 重新安装

### 2. 使用yarn替代npm
```bash
# 安装yarn
npm install -g yarn

# 使用yarn安装依赖
yarn install

# 启动应用
yarn dev
```

### 3. 使用Docker
```bash
# 使用Docker运行
docker run -it -p 3000:3000 -v $(pwd):/app node:18 bash
cd /app
npm install --legacy-peer-deps
npm start
```

---

**记住：终极修复脚本已经包含了所有这些解决方案，大多数情况下您只需要双击启动脚本即可！** 🚀

