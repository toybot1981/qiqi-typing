#!/bin/bash

echo "🐧 小企打字通 - 终极修复版启动脚本"
echo "========================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js"
    echo "请先安装Node.js (版本18.0.0或更高)"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm"
    echo "请确保npm已正确安装"
    exit 1
fi

# 显示版本信息
echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"
echo "✅ 操作系统: $(uname -s)"
echo ""

echo "🔧 正在进行npm配置诊断和修复..."

# 1. 清理npm配置中的代理设置
echo "🔍 检查npm代理配置..."
npm config delete proxy 2>/dev/null || true
npm config delete https-proxy 2>/dev/null || true
npm config delete http-proxy 2>/dev/null || true
npm config delete registry 2>/dev/null || true
echo "✅ 清理代理配置完成"

# 2. 设置可靠的镜像源
echo "🌐 设置npm镜像源..."
npm config set registry https://registry.npmjs.org/
echo "✅ 设置官方镜像源完成"

# 3. 清理npm缓存
echo "🗑️ 清理npm缓存..."
npm cache clean --force 2>/dev/null || true
echo "✅ 缓存清理完成"

# 4. 设置npm配置
echo "⚙️ 优化npm配置..."
npm config set fetch-retries 3
npm config set fetch-retry-factor 10
npm config set fetch-retry-mintimeout 10000
npm config set fetch-retry-maxtimeout 60000
npm config set maxsockets 1
echo "✅ npm配置优化完成"

# 5. 检查并清理项目依赖
echo "📦 检查项目依赖状态..."
if [ -d "node_modules" ]; then
    echo "🗑️ 发现旧依赖，正在清理..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "🗑️ 清理锁定文件..."
    rm -f package-lock.json
fi

if [ -f "yarn.lock" ]; then
    echo "🗑️ 清理yarn锁定文件..."
    rm -f yarn.lock
fi

echo "✅ 项目清理完成"

# 6. 尝试不同的安装策略
echo ""
echo "📦 开始安装依赖（使用多重策略）..."

# 策略1: 使用官方源
echo "🔄 策略1: 使用npm官方源..."
if npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline=false 2>/dev/null; then
    echo "✅ 策略1成功！"
    INSTALL_SUCCESS=true
else
    echo "❌ 策略1失败，尝试策略2..."
    INSTALL_SUCCESS=false
fi

# 策略2: 使用淘宝镜像
if [ "$INSTALL_SUCCESS" = false ]; then
    echo "🔄 策略2: 使用淘宝镜像..."
    npm config set registry https://registry.npmmirror.com/
    if npm install --legacy-peer-deps --no-audit --no-fund 2>/dev/null; then
        echo "✅ 策略2成功！"
        INSTALL_SUCCESS=true
    else
        echo "❌ 策略2失败，尝试策略3..."
        INSTALL_SUCCESS=false
    fi
fi

# 策略3: 使用cnpm
if [ "$INSTALL_SUCCESS" = false ]; then
    echo "🔄 策略3: 尝试安装cnpm..."
    if command -v cnpm &> /dev/null || npm install -g cnpm --registry=https://registry.npmmirror.com/ 2>/dev/null; then
        echo "🔄 使用cnpm安装依赖..."
        if cnpm install 2>/dev/null; then
            echo "✅ 策略3成功！"
            INSTALL_SUCCESS=true
        else
            echo "❌ 策略3失败，尝试策略4..."
            INSTALL_SUCCESS=false
        fi
    else
        echo "❌ cnpm安装失败，跳过策略3..."
        INSTALL_SUCCESS=false
    fi
fi

# 策略4: 手动处理问题依赖
if [ "$INSTALL_SUCCESS" = false ]; then
    echo "🔄 策略4: 手动处理问题依赖..."
    
    # 重置npm配置
    npm config set registry https://registry.npmjs.org/
    
    # 尝试安装核心依赖
    echo "📦 安装核心依赖..."
    npm install react react-dom --legacy-peer-deps --no-audit 2>/dev/null || true
    npm install vite @vitejs/plugin-react --legacy-peer-deps --no-audit 2>/dev/null || true
    npm install tailwindcss --legacy-peer-deps --no-audit 2>/dev/null || true
    
    # 再次尝试完整安装
    if npm install --legacy-peer-deps --no-audit --no-fund 2>/dev/null; then
        echo "✅ 策略4成功！"
        INSTALL_SUCCESS=true
    else
        echo "❌ 所有策略都失败了"
        INSTALL_SUCCESS=false
    fi
fi

# 检查安装结果
if [ "$INSTALL_SUCCESS" = true ]; then
    echo ""
    echo "🎉 依赖安装成功！"
    echo ""
    echo "🚀 正在启动小企打字通..."
    echo "应用将在浏览器中自动打开"
    echo "访问地址: http://localhost:3000"
    echo ""
    echo "按 Ctrl+C 停止应用"
    echo "========================================"
    
    # 启动应用
    npm start
else
    echo ""
    echo "❌ 依赖安装失败"
    echo ""
    echo "🔧 手动解决方案："
    echo "1. 检查网络连接"
    echo "2. 尝试使用手机热点"
    echo "3. 关闭VPN或代理软件"
    echo "4. 手动运行以下命令："
    echo "   npm config delete proxy"
    echo "   npm config delete https-proxy"
    echo "   npm cache clean --force"
    echo "   npm install --legacy-peer-deps"
    echo ""
    echo "5. 如果仍有问题，请尝试："
    echo "   npm config set registry https://registry.npmmirror.com/"
    echo "   npm install --legacy-peer-deps"
    echo ""
    exit 1
fi

