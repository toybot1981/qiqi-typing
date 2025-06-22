import React, { useState, useEffect } from 'react';

// 键盘布局数据
const keyboardLayout = [
  // 第一行 - 数字行
  [
    { key: '`', finger: 'left-pinky', x: 0, y: 0 },
    { key: '1', finger: 'left-pinky', x: 1, y: 0 },
    { key: '2', finger: 'left-ring', x: 2, y: 0 },
    { key: '3', finger: 'left-middle', x: 3, y: 0 },
    { key: '4', finger: 'left-index', x: 4, y: 0 },
    { key: '5', finger: 'left-index', x: 5, y: 0 },
    { key: '6', finger: 'right-index', x: 6, y: 0 },
    { key: '7', finger: 'right-index', x: 7, y: 0 },
    { key: '8', finger: 'right-middle', x: 8, y: 0 },
    { key: '9', finger: 'right-ring', x: 9, y: 0 },
    { key: '0', finger: 'right-pinky', x: 10, y: 0 },
    { key: '-', finger: 'right-pinky', x: 11, y: 0 },
    { key: '=', finger: 'right-pinky', x: 12, y: 0 },
    { key: 'Backspace', finger: 'right-pinky', x: 13, y: 0, width: 2 }
  ],
  // 第二行 - QWERTY行
  [
    { key: 'Tab', finger: 'left-pinky', x: 0, y: 1, width: 1.5 },
    { key: 'Q', finger: 'left-pinky', x: 1.5, y: 1 },
    { key: 'W', finger: 'left-ring', x: 2.5, y: 1 },
    { key: 'E', finger: 'left-middle', x: 3.5, y: 1 },
    { key: 'R', finger: 'left-index', x: 4.5, y: 1 },
    { key: 'T', finger: 'left-index', x: 5.5, y: 1 },
    { key: 'Y', finger: 'right-index', x: 6.5, y: 1 },
    { key: 'U', finger: 'right-index', x: 7.5, y: 1 },
    { key: 'I', finger: 'right-middle', x: 8.5, y: 1 },
    { key: 'O', finger: 'right-ring', x: 9.5, y: 1 },
    { key: 'P', finger: 'right-pinky', x: 10.5, y: 1 },
    { key: '[', finger: 'right-pinky', x: 11.5, y: 1 },
    { key: ']', finger: 'right-pinky', x: 12.5, y: 1 },
    { key: '\\', finger: 'right-pinky', x: 13.5, y: 1, width: 1.5 }
  ],
  // 第三行 - ASDF行（基准行）
  [
    { key: 'Caps', finger: 'left-pinky', x: 0, y: 2, width: 1.75 },
    { key: 'A', finger: 'left-pinky', x: 1.75, y: 2, isHome: true },
    { key: 'S', finger: 'left-ring', x: 2.75, y: 2, isHome: true },
    { key: 'D', finger: 'left-middle', x: 3.75, y: 2, isHome: true },
    { key: 'F', finger: 'left-index', x: 4.75, y: 2, isHome: true },
    { key: 'G', finger: 'left-index', x: 5.75, y: 2 },
    { key: 'H', finger: 'right-index', x: 6.75, y: 2 },
    { key: 'J', finger: 'right-index', x: 7.75, y: 2, isHome: true },
    { key: 'K', finger: 'right-middle', x: 8.75, y: 2, isHome: true },
    { key: 'L', finger: 'right-ring', x: 9.75, y: 2, isHome: true },
    { key: ';', finger: 'right-pinky', x: 10.75, y: 2, isHome: true },
    { key: "'", finger: 'right-pinky', x: 11.75, y: 2 },
    { key: 'Enter', finger: 'right-pinky', x: 12.75, y: 2, width: 2.25 }
  ],
  // 第四行 - ZXCV行
  [
    { key: 'Shift', finger: 'left-pinky', x: 0, y: 3, width: 2.25 },
    { key: 'Z', finger: 'left-pinky', x: 2.25, y: 3 },
    { key: 'X', finger: 'left-ring', x: 3.25, y: 3 },
    { key: 'C', finger: 'left-middle', x: 4.25, y: 3 },
    { key: 'V', finger: 'left-index', x: 5.25, y: 3 },
    { key: 'B', finger: 'left-index', x: 6.25, y: 3 },
    { key: 'N', finger: 'right-index', x: 7.25, y: 3 },
    { key: 'M', finger: 'right-index', x: 8.25, y: 3 },
    { key: ',', finger: 'right-middle', x: 9.25, y: 3 },
    { key: '.', finger: 'right-ring', x: 10.25, y: 3 },
    { key: '/', finger: 'right-pinky', x: 11.25, y: 3 },
    { key: 'Shift', finger: 'right-pinky', x: 12.25, y: 3, width: 2.75 }
  ],
  // 第五行 - 空格行
  [
    { key: 'Ctrl', finger: 'left-pinky', x: 0, y: 4, width: 1.25 },
    { key: 'Win', finger: 'left-pinky', x: 1.25, y: 4, width: 1.25 },
    { key: 'Alt', finger: 'left-thumb', x: 2.5, y: 4, width: 1.25 },
    { key: 'Space', finger: 'thumb', x: 3.75, y: 4, width: 6.25 },
    { key: 'Alt', finger: 'right-thumb', x: 10, y: 4, width: 1.25 },
    { key: 'Win', finger: 'right-pinky', x: 11.25, y: 4, width: 1.25 },
    { key: 'Menu', finger: 'right-pinky', x: 12.5, y: 4, width: 1.25 },
    { key: 'Ctrl', finger: 'right-pinky', x: 13.75, y: 4, width: 1.25 }
  ]
];

// 手指颜色映射
const fingerColors = {
  'left-pinky': '#FF6B9D',     // 粉色
  'left-ring': '#4ECDC4',      // 青色
  'left-middle': '#45B7D1',    // 蓝色
  'left-index': '#96CEB4',     // 绿色
  'left-thumb': '#FFEAA7',     // 黄色
  'right-thumb': '#FFEAA7',    // 黄色
  'right-index': '#96CEB4',    // 绿色
  'right-middle': '#45B7D1',   // 蓝色
  'right-ring': '#4ECDC4',     // 青色
  'right-pinky': '#FF6B9D',    // 粉色
  'thumb': '#FFEAA7'           // 黄色（空格键）
};

// 手指名称映射
const fingerNames = {
  'left-pinky': '左手小指',
  'left-ring': '左手无名指',
  'left-middle': '左手中指',
  'left-index': '左手食指',
  'left-thumb': '左手拇指',
  'right-thumb': '右手拇指',
  'right-index': '右手食指',
  'right-middle': '右手中指',
  'right-ring': '右手无名指',
  'right-pinky': '右手小指',
  'thumb': '拇指'
};

const VirtualKeyboard = ({ 
  isVisible = false, 
  highlightKey = null, 
  onToggleVisibility,
  showFingerHint = true 
}) => {
  const [pressedKey, setPressedKey] = useState(null);

  // 获取按键信息
  const getKeyInfo = (keyChar) => {
    const upperKey = keyChar.toUpperCase();
    for (const row of keyboardLayout) {
      for (const keyData of row) {
        if (keyData.key.toUpperCase() === upperKey || keyData.key === keyChar) {
          return keyData;
        }
      }
    }
    return null;
  };

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      setPressedKey(key);
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVisible]);

  // 渲染单个按键
  const renderKey = (keyData) => {
    const isHighlighted = highlightKey && keyData.key.toUpperCase() === highlightKey.toUpperCase();
    const isPressed = pressedKey && keyData.key.toUpperCase() === pressedKey;
    const isHomeRow = keyData.isHome;
    
    const keyStyle = {
      position: 'absolute',
      left: `${keyData.x * 40 + 4}px`,
      top: `${keyData.y * 40 + 4}px`,
      width: `${(keyData.width || 1) * 40 - 8}px`,
      height: '32px',
      backgroundColor: isPressed ? '#FFD93D' : 
                      isHighlighted ? fingerColors[keyData.finger] : 
                      isHomeRow ? '#F0F8FF' : '#FFFFFF',
      border: `2px solid ${isHighlighted ? fingerColors[keyData.finger] : '#E0E0E0'}`,
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      color: isPressed || isHighlighted ? '#FFFFFF' : '#333333',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isPressed ? 'inset 0 2px 4px rgba(0,0,0,0.2)' : 
                 isHighlighted ? `0 0 10px ${fingerColors[keyData.finger]}40` : 
                 '0 2px 4px rgba(0,0,0,0.1)',
      transform: isPressed ? 'translateY(1px)' : 'translateY(0)',
      zIndex: isHighlighted ? 10 : 1
    };

    return (
      <div
        key={`${keyData.key}-${keyData.x}-${keyData.y}`}
        style={keyStyle}
        className="cute-scale-in"
      >
        {keyData.key}
        {isHomeRow && (
          <div style={{
            position: 'absolute',
            bottom: '2px',
            width: '4px',
            height: '2px',
            backgroundColor: '#666',
            borderRadius: '1px'
          }} />
        )}
      </div>
    );
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggleVisibility}
          className="cute-button flex items-center gap-2"
          title="显示虚拟键盘"
        >
          ⌨️ 显示键盘
        </button>
      </div>
    );
  }

  const currentKeyInfo = highlightKey ? getKeyInfo(highlightKey) : null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="cute-card" style={{ padding: '16px', minWidth: '600px' }}>
        {/* 键盘标题和控制 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            ⌨️ 虚拟键盘
          </h3>
          <button
            onClick={onToggleVisibility}
            className="text-gray-500 hover:text-gray-700 text-xl"
            title="隐藏键盘"
          >
            ✕
          </button>
        </div>

        {/* 手指提示 */}
        {showFingerHint && currentKeyInfo && (
          <div className="mb-4 p-3 rounded-lg" style={{
            backgroundColor: `${fingerColors[currentKeyInfo.finger]}20`,
            border: `2px solid ${fingerColors[currentKeyInfo.finger]}`
          }}>
            <div className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: fingerColors[currentKeyInfo.finger] }}
              />
              <span className="font-bold text-gray-700">
                请用 <span style={{ color: fingerColors[currentKeyInfo.finger] }}>
                  {fingerNames[currentKeyInfo.finger]}
                </span> 按下 "{highlightKey}" 键
              </span>
            </div>
          </div>
        )}

        {/* 键盘布局 */}
        <div 
          className="relative bg-gray-100 rounded-lg p-2"
          style={{ 
            width: '600px', 
            height: '200px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          {keyboardLayout.flat().map(renderKey)}
        </div>

        {/* 手指颜色图例 */}
        <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
          {Object.entries(fingerNames).map(([finger, name]) => (
            <div key={finger} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: fingerColors[finger] }}
              />
              <span className="text-gray-600">{name}</span>
            </div>
          ))}
        </div>

        {/* 使用说明 */}
        <div className="mt-3 text-xs text-gray-500 text-center">
          💡 基准键位（ASDF JKL;）有小圆点标记，是手指的起始位置
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;

