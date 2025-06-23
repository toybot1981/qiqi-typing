@echo off
chcp 65001 >nul
title 小企打字通 - 终极修复版

echo 🐧 小企打字通 - 终极修复版启动脚本
echo ========================================

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到Node.js
    echo 请先安装Node.js ^(版本18.0.0或更高^)
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到npm
    echo 请确保npm已正确安装
    pause
    exit /b 1
)

REM 显示版本信息
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ Node.js版本: %NODE_VERSION%
echo ✅ npm版本: %NPM_VERSION%
echo ✅ 操作系统: Windows
echo.

echo 🔧 正在进行npm配置诊断和修复...

REM 1. 清理npm配置中的代理设置
echo 🔍 检查npm代理配置...
npm config delete proxy >nul 2>&1
npm config delete https-proxy >nul 2>&1
npm config delete http-proxy >nul 2>&1
npm config delete registry >nul 2>&1
echo ✅ 清理代理配置完成

REM 2. 设置可靠的镜像源
echo 🌐 设置npm镜像源...
npm config set registry https://registry.npmjs.org/
echo ✅ 设置官方镜像源完成

REM 3. 清理npm缓存
echo 🗑️ 清理npm缓存...
npm cache clean --force >nul 2>&1
echo ✅ 缓存清理完成

REM 4. 设置npm配置
echo ⚙️ 优化npm配置...
npm config set fetch-retries 3
npm config set fetch-retry-factor 10
npm config set fetch-retry-mintimeout 10000
npm config set fetch-retry-maxtimeout 60000
npm config set maxsockets 1
echo ✅ npm配置优化完成

REM 5. 检查并清理项目依赖
echo 📦 检查项目依赖状态...
if exist "node_modules" (
    echo 🗑️ 发现旧依赖，正在清理...
    rmdir /s /q node_modules >nul 2>&1
)

if exist "package-lock.json" (
    echo 🗑️ 清理锁定文件...
    del package-lock.json >nul 2>&1
)

if exist "yarn.lock" (
    echo 🗑️ 清理yarn锁定文件...
    del yarn.lock >nul 2>&1
)

echo ✅ 项目清理完成

REM 6. 尝试不同的安装策略
echo.
echo 📦 开始安装依赖^(使用多重策略^)...

REM 策略1: 使用官方源
echo 🔄 策略1: 使用npm官方源...
npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline=false >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 策略1成功！
    set INSTALL_SUCCESS=true
    goto start_app
) else (
    echo ❌ 策略1失败，尝试策略2...
    set INSTALL_SUCCESS=false
)

REM 策略2: 使用淘宝镜像
echo 🔄 策略2: 使用淘宝镜像...
npm config set registry https://registry.npmmirror.com/
npm install --legacy-peer-deps --no-audit --no-fund >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 策略2成功！
    set INSTALL_SUCCESS=true
    goto start_app
) else (
    echo ❌ 策略2失败，尝试策略3...
    set INSTALL_SUCCESS=false
)

REM 策略3: 手动处理问题依赖
echo 🔄 策略3: 手动处理问题依赖...

REM 重置npm配置
npm config set registry https://registry.npmjs.org/

REM 尝试安装核心依赖
echo 📦 安装核心依赖...
npm install react react-dom --legacy-peer-deps --no-audit >nul 2>&1
npm install vite @vitejs/plugin-react --legacy-peer-deps --no-audit >nul 2>&1
npm install tailwindcss --legacy-peer-deps --no-audit >nul 2>&1

REM 再次尝试完整安装
npm install --legacy-peer-deps --no-audit --no-fund >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 策略3成功！
    set INSTALL_SUCCESS=true
    goto start_app
) else (
    echo ❌ 所有策略都失败了
    set INSTALL_SUCCESS=false
    goto install_failed
)

:start_app
echo.
echo 🎉 依赖安装成功！
echo.
echo 🚀 正在启动小企打字通...
echo 应用将在浏览器中自动打开
echo 访问地址: http://localhost:3000
echo.
echo 按 Ctrl+C 停止应用
echo ========================================

REM 启动应用
npm start
goto end

:install_failed
echo.
echo ❌ 依赖安装失败
echo.
echo 🔧 手动解决方案：
echo 1. 检查网络连接
echo 2. 尝试使用手机热点
echo 3. 关闭VPN或代理软件
echo 4. 手动运行以下命令：
echo    npm config delete proxy
echo    npm config delete https-proxy
echo    npm cache clean --force
echo    npm install --legacy-peer-deps
echo.
echo 5. 如果仍有问题，请尝试：
echo    npm config set registry https://registry.npmmirror.com/
echo    npm install --legacy-peer-deps
echo.
pause
exit /b 1

:end
pause

