import React, { useState, useEffect, useCallback } from 'react';

// 手指颜色映射
const FINGER_COLORS = {
  'left-pinky': '#FF6B6B',      // 左小指 - 红色
  'left-ring': '#4ECDC4',       // 左无名指 - 青色
  'left-middle': '#45B7D1',     // 左中指 - 蓝色
  'left-index': '#96CEB4',      // 左食指 - 绿色
  'left-thumb': '#FFEAA7',      // 左拇指 - 黄色
  'right-thumb': '#FFEAA7',     // 右拇指 - 黄色
  'right-index': '#96CEB4',     // 右食指 - 绿色
  'right-middle': '#45B7D1',    // 右中指 - 蓝色
  'right-ring': '#4ECDC4',      // 右无名指 - 青色
  'right-pinky': '#FF6B6B'      // 右小指 - 红色
};

// 键位到手指的映射
const KEY_TO_FINGER = {
  // 数字行
  '`': 'left-pinky', '1': 'left-pinky', '2': 'left-ring', '3': 'left-middle', '4': 'left-index', '5': 'left-index',
  '6': 'right-index', '7': 'right-index', '8': 'right-middle', '9': 'right-ring', '0': 'right-pinky', '-': 'right-pinky', '=': 'right-pinky',
  
  // 第一行字母
  'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle', 'r': 'left-index', 't': 'left-index',
  'y': 'right-index', 'u': 'right-index', 'i': 'right-middle', 'o': 'right-ring', 'p': 'right-pinky', '[': 'right-pinky', ']': 'right-pinky',
  
  // 第二行字母（基准行）
  'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle', 'f': 'left-index', 'g': 'left-index',
  'h': 'right-index', 'j': 'right-index', 'k': 'right-middle', 'l': 'right-ring', ';': 'right-pinky', "'": 'right-pinky',
  
  // 第三行字母
  'z': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle', 'v': 'left-index', 'b': 'left-index',
  'n': 'right-index', 'm': 'right-index', ',': 'right-middle', '.': 'right-ring', '/': 'right-pinky',
  
  // 空格键
  ' ': 'right-thumb'
};

// 键盘布局
const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

// 单个字母练习序列（包含空格）
const PRACTICE_LETTERS = [
  // 基准行（最重要）
  'a', 's', 'd', 'f', 'j', 'k', 'l', ';',
  // 插入一个空格练习
  ' ',
  // 上排常用字母
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  // 再插入一个空格练习
  ' ',
  // 下排字母
  'z', 'x', 'c', 'v', 'b', 'n', 'm',
  // 最后一个空格练习
  ' ',
  // 数字
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
];

// 手指名称映射
const FINGER_NAMES = {
  'left-pinky': '左小指',
  'left-ring': '左无名指',
  'left-middle': '左中指',
  'left-index': '左食指',
  'left-thumb': '左拇指',
  'right-thumb': '右拇指',
  'right-index': '右食指',
  'right-middle': '右中指',
  'right-ring': '右无名指',
  'right-pinky': '右小指'
};

const FingerPracticeGame = ({ onBack }) => {
  // 添加响应式样式
  const responsiveStyles = `
    /* 响应式键盘样式 */
    .keyboard-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 0;
    }

    /* 不同分辨率的适配 */
    /* 1024*640 - 小屏幕 */
    @media (max-width: 1024px) and (max-height: 640px) {
      .keyboard-container {
        transform: scale(0.8);
        transform-origin: center;
      }
      
      .practice-content {
        font-size: 2rem !important;
      }
      
      .hand-display svg {
        width: 80px !important;
        height: 100px !important;
      }
    }

    /* 1280*800 - 标准屏幕 */
    @media (min-width: 1280px) and (min-height: 800px) {
      .keyboard-container {
        transform: scale(1.1);
        transform-origin: center;
      }
      
      .practice-content {
        font-size: 3.5rem !important;
      }
      
      .hand-display svg {
        width: 120px !important;
        height: 140px !important;
      }
    }

    /* 1440*900 - 大屏幕 */
    @media (min-width: 1440px) and (min-height: 900px) {
      .keyboard-container {
        transform: scale(1.05);
        transform-origin: center;
      }
      
      .practice-content {
        font-size: 3.2rem !important;
      }
      
      .hand-display svg {
        width: 110px !important;
        height: 130px !important;
      }
    }

    /* 1680*1050 - 超大屏幕 */
    @media (min-width: 1680px) and (min-height: 1050px) {
      .keyboard-container {
        transform: scale(1.1);
        transform-origin: center;
      }
      
      .practice-content {
        font-size: 3.8rem !important;
      }
      
      .hand-display svg {
        width: 120px !important;
        height: 140px !important;
      }
    }

    /* 键盘动画 */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1.1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.15);
      }
    }

    @keyframes errorShake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
      20%, 40%, 60%, 80% { transform: translateX(3px); }
    }

    /* 确保键盘在所有分辨率下都居中 */
    .keyboard-row {
      display: flex;
      justify-content: center;
      margin-bottom: 4px;
    }

    /* 手部图形响应式 */
    .hand-display {
      transition: all 0.3s ease;
    }

    /* 练习内容响应式 */
    .practice-content {
      transition: all 0.3s ease;
    }
  `;

  // 动态添加样式到页面
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = responsiveStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [currentLetter, setCurrentLetter] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [animatingKeys, setAnimatingKeys] = useState(new Set());
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [correctKeys, setCorrectKeys] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentFinger, setCurrentFinger] = useState('');
  const [errorKeys, setErrorKeys] = useState(new Set());

  // 生成新的练习字母
  const generateNewLetter = () => {
    const letter = PRACTICE_LETTERS[letterIndex % PRACTICE_LETTERS.length];
    setCurrentLetter(letter);
    setCurrentFinger(KEY_TO_FINGER[letter] || '');
    setLetterIndex(prev => prev + 1);
  };

  // 触发键盘动画
  const triggerKeyAnimation = (key, isCorrect = true) => {
    if (isCorrect) {
      setAnimatingKeys(prev => new Set([...prev, key]));
      setTimeout(() => {
        setAnimatingKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 300);
    } else {
      setErrorKeys(prev => new Set([...prev, key]));
      setTimeout(() => {
        setErrorKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 300);
    }
  };

  // 获取键盘样式（响应式设计）
  const getKeyStyle = (key) => {
    // 检查是否是当前目标键
    const isCurrentTarget = (
      (currentLetter === ' ' && key === 'Space') ||
      (currentLetter !== ' ' && key.toLowerCase() === currentLetter.toLowerCase())
    );
    
    // 检查按键状态时需要处理空格键的特殊情况
    const checkKey = key === 'Space' ? ' ' : key.toLowerCase();
    const isPressed = pressedKeys.has(checkKey);
    const isAnimating = animatingKeys.has(checkKey);
    const isError = errorKeys.has(checkKey);
    
    const baseColor = FINGER_COLORS[KEY_TO_FINGER[key.toLowerCase()]] || '#E5E7EB';    
    const style = {
      backgroundColor: baseColor,
      color: '#374151',
      border: '2px solid #D1D5DB',
      borderRadius: '8px',
      margin: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      userSelect: 'none',
      // 响应式尺寸
      height: 'clamp(35px, 4.5vw, 55px)',
      minWidth: 'clamp(30px, 4vw, 50px)',
      fontSize: 'clamp(10px, 1.2vw, 16px)',
      // 在大屏幕上使用更大的尺寸
      '@media (min-width: 1200px)': {
        height: '60px',
        minWidth: '55px',
        fontSize: '18px'
      }
    };

    // 特殊键的宽度调整（响应式）
    if (key === 'Backspace' || key === 'Enter') {
      style.minWidth = 'clamp(50px, 6vw, 80px)';
    } else if (key === 'Tab' || key === 'CapsLock') {
      style.minWidth = 'clamp(45px, 5.5vw, 75px)';
    } else if (key === 'Shift') {
      style.minWidth = 'clamp(60px, 7vw, 90px)';
    } else if (key === 'Space') {
      style.minWidth = 'clamp(120px, 15vw, 200px)';
    } else if (key === 'Ctrl' || key === 'Alt') {
      style.minWidth = 'clamp(35px, 4.5vw, 60px)';
    }

    // 当前目标键高亮效果
    if (isCurrentTarget) {
      style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.8)';
      style.border = '3px solid #3B82F6';
      style.transform = 'scale(1.1)';
      style.zIndex = 10;
      style.animation = 'pulse 1.5s infinite';
    }

    // 按下的键效果
    if (isPressed) {
      style.transform = isCurrentTarget ? 'scale(1.05)' : 'scale(0.95)';
      style.boxShadow = 'inset 0 3px 8px rgba(0, 0, 0, 0.3)';
      style.backgroundColor = '#FFFFFF';
      style.color = baseColor;
      style.border = '2px solid ' + baseColor;
    }

    // 正确动画效果（不抖动）
    if (isAnimating) {
      style.backgroundColor = '#10B981';
      style.color = '#FFFFFF';
      style.transform = 'scale(1.15)';
      style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.8)';
    }

    // 错误动画效果（抖动）
    if (isError) {
      style.backgroundColor = '#EF4444';
      style.color = '#FFFFFF';
      style.animation = 'errorShake 0.6s ease-out';
    }

    return style;
  };

  // 左手图形组件（手背朝外，更好看）
  const LeftHandDisplay = () => (
    <div className="relative">
      <svg width="100" height="120" viewBox="0 0 200 250" className="mx-auto">
        {/* 手掌 */}
        <ellipse cx="100" cy="180" rx="50" ry="60" fill="#FFE4B5" stroke="#DEB887" strokeWidth="2"/>
        
        {/* 手腕 */}
        <rect x="75" y="220" width="50" height="30" rx="15" fill="#FFE4B5" stroke="#DEB887" strokeWidth="2"/>
        
        {/* 小指 */}
        <ellipse 
          cx="60" cy="90" rx="8" ry="35" 
          fill={currentFinger === 'left-pinky' ? FINGER_COLORS['left-pinky'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'left-pinky' ? 'animate-pulse' : ''}
        />
        <circle cx="60" cy="70" r="6" fill={currentFinger === 'left-pinky' ? FINGER_COLORS['left-pinky'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 无名指 */}
        <ellipse 
          cx="80" cy="75" rx="8" ry="40" 
          fill={currentFinger === 'left-ring' ? FINGER_COLORS['left-ring'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'left-ring' ? 'animate-pulse' : ''}
        />
        <circle cx="80" cy="50" r="6" fill={currentFinger === 'left-ring' ? FINGER_COLORS['left-ring'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 中指 */}
        <ellipse 
          cx="100" cy="70" rx="8" ry="45" 
          fill={currentFinger === 'left-middle' ? FINGER_COLORS['left-middle'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'left-middle' ? 'animate-pulse' : ''}
        />
        <circle cx="100" cy="40" r="6" fill={currentFinger === 'left-middle' ? FINGER_COLORS['left-middle'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 食指 */}
        <ellipse 
          cx="120" cy="80" rx="8" ry="40" 
          fill={currentFinger === 'left-index' ? FINGER_COLORS['left-index'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'left-index' ? 'animate-pulse' : ''}
        />
        <circle cx="120" cy="55" r="6" fill={currentFinger === 'left-index' ? FINGER_COLORS['left-index'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 拇指 */}
        <ellipse 
          cx="140" cy="140" rx="12" ry="30" 
          fill={currentFinger === 'left-thumb' ? FINGER_COLORS['left-thumb'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'left-thumb' ? 'animate-pulse' : ''}
          transform="rotate(30 140 140)"
        />
        <circle cx="145" cy="120" r="7" fill={currentFinger === 'left-thumb' ? FINGER_COLORS['left-thumb'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 手指关节线 */}
        <line x1="60" y1="85" x2="60" y2="95" stroke="#DEB887" strokeWidth="1" opacity="0.5"/>
        <line x1="80" y1="80" x2="80" y2="90" stroke="#DEB887" strokeWidth="1" opacity="0.5"/>
        <line x1="100" y1="75" x2="100" y2="85" stroke="#DEB887" strokeWidth="1" opacity="0.5"/>
        <line x1="120" y1="85" x2="120" y2="95" stroke="#DEB887" strokeWidth="1" opacity="0.5"/>
        
        {/* 手指标签 */}
        {currentFinger === 'left-thumb' && <text x="140" y="200" textAnchor="middle" className="text-xs font-bold fill-gray-700">拇指</text>}
        {currentFinger === 'left-index' && <text x="120" y="35" textAnchor="middle" className="text-xs font-bold fill-gray-700">食指</text>}
        {currentFinger === 'left-middle' && <text x="100" y="25" textAnchor="middle" className="text-xs font-bold fill-gray-700">中指</text>}
        {currentFinger === 'left-ring' && <text x="80" y="30" textAnchor="middle" className="text-xs font-bold fill-gray-700">无名指</text>}
        {currentFinger === 'left-pinky' && <text x="60" y="50" textAnchor="middle" className="text-xs font-bold fill-gray-700">小指</text>}
      </svg>
      <div className="text-center">
        <h4 className="text-xs font-bold text-gray-700">左手</h4>
      </div>
    </div>
  );

  // 右手图形组件（手背朝外，更好看）
  const RightHandDisplay = () => (
    <div className="relative">
      <svg width="100" height="120" viewBox="0 0 200 250" className="mx-auto">
        {/* 手掌 */}
        <ellipse cx="100" cy="180" rx="50" ry="60" fill="#FFE4B5" stroke="#DEB887" strokeWidth="2"/>
        
        {/* 手腕 */}
        <rect x="75" y="220" width="50" height="30" rx="15" fill="#FFE4B5" stroke="#DEB887" strokeWidth="2"/>
        
        {/* 食指 */}
        <ellipse 
          cx="80" cy="80" rx="8" ry="40" 
          fill={currentFinger === 'right-index' ? FINGER_COLORS['right-index'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'right-index' ? 'animate-pulse' : ''}
        />
        <circle cx="80" cy="55" r="6" fill={currentFinger === 'right-index' ? FINGER_COLORS['right-index'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 中指 */}
        <ellipse 
          cx="100" cy="70" rx="8" ry="45" 
          fill={currentFinger === 'right-middle' ? FINGER_COLORS['right-middle'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'right-middle' ? 'animate-pulse' : ''}
        />
        <circle cx="100" cy="40" r="6" fill={currentFinger === 'right-middle' ? FINGER_COLORS['right-middle'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 无名指 */}
        <ellipse 
          cx="120" cy="75" rx="8" ry="40" 
          fill={currentFinger === 'right-ring' ? FINGER_COLORS['right-ring'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'right-ring' ? 'animate-pulse' : ''}
        />
        <circle cx="120" cy="50" r="6" fill={currentFinger === 'right-ring' ? FINGER_COLORS['right-ring'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 小指 */}
        <ellipse 
          cx="140" cy="90" rx="8" ry="35" 
          fill={currentFinger === 'right-pinky' ? FINGER_COLORS['right-pinky'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'right-pinky' ? 'animate-pulse' : ''}
        />
        <circle cx="140" cy="70" r="6" fill={currentFinger === 'right-pinky' ? FINGER_COLORS['right-pinky'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 拇指 */}
        <ellipse 
          cx="60" cy="140" rx="12" ry="30" 
          fill={currentFinger === 'right-thumb' ? FINGER_COLORS['right-thumb'] : '#FFE4B5'} 
          stroke="#DEB887" strokeWidth="2"
          className={currentFinger === 'right-thumb' ? 'animate-pulse' : ''}
          transform="rotate(-30 60 140)"
        />
        <circle cx="55" cy="120" r="7" fill={currentFinger === 'right-thumb' ? FINGER_COLORS['right-thumb'] : '#FFE4B5'} stroke="#DEB887" strokeWidth="1"/>
        
        {/* 手指关节线 */}
        <line x1="80" y1="85" x2="80" y2="95" stroke="#DEB887" strokeWidth="1" opacity="0.5"/>
        <line x1="100" y1="75" x2="100" y2="85" stroke="#DEB887" strokeWidth="1" opacity="0.5"/>
        <line x1="120" y1="80" x2="120" y2="90" stroke="#DEB887" strokeWidth="1" opacity="0.5"/>
        <line x1="140" y1="85" x2="140" y2="95" stroke="#DEB887" strokeWidth="1" opacity="0.5"/>
        
        {/* 手指标签 */}
        {currentFinger === 'right-index' && <text x="80" y="35" textAnchor="middle" className="text-xs font-bold fill-gray-700">食指</text>}
        {currentFinger === 'right-middle' && <text x="100" y="25" textAnchor="middle" className="text-xs font-bold fill-gray-700">中指</text>}
        {currentFinger === 'right-ring' && <text x="120" y="30" textAnchor="middle" className="text-xs font-bold fill-gray-700">无名指</text>}
        {currentFinger === 'right-pinky' && <text x="140" y="50" textAnchor="middle" className="text-xs font-bold fill-gray-700">小指</text>}
        {currentFinger === 'right-thumb' && <text x="60" y="200" textAnchor="middle" className="text-xs font-bold fill-gray-700">拇指</text>}
      </svg>
      <div className="text-center">
        <h4 className="text-xs font-bold text-gray-700">右手</h4>
      </div>
    </div>
  );

  // 处理键盘按下
  const handleKeyDown = useCallback((event) => {
    if (!gameStarted) return;
    
    // 防止默认行为（特别是空格键滚动页面）
    if (event.key === ' ') {
      event.preventDefault();
    }
    
    const key = event.key;
    const normalizedKey = key === ' ' ? ' ' : key.toLowerCase();
    
    setPressedKeys(prev => new Set([...prev, normalizedKey]));
    
    setTotalKeys(prev => prev + 1);
    
    // 检查是否是正确的按键
    const isCorrect = (currentLetter === ' ' && key === ' ') || 
                     (currentLetter !== ' ' && normalizedKey === currentLetter.toLowerCase());
    
    if (isCorrect) {
      // 正确按键
      triggerKeyAnimation(normalizedKey, true);
      setScore(prev => prev + 10 + combo * 2);
      setCorrectKeys(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(current => Math.max(current, newCombo));
        return newCombo;
      });
      
      // 生成新字母
      setTimeout(() => {
        generateNewLetter();
      }, 300);
    } else {
      // 错误按键
      triggerKeyAnimation(normalizedKey, false);
      setCombo(0);
    }
  }, [gameStarted, currentLetter, combo]);

  // 处理键盘释放
  const handleKeyUp = useCallback((event) => {
    const key = event.key;
    const normalizedKey = key === ' ' ? ' ' : key.toLowerCase();
    
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(normalizedKey);
      return newSet;
    });
  }, []);

  // 绑定键盘事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // 开始游戏
  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    setScore(0);
    setCorrectKeys(0);
    setTotalKeys(0);
    setCombo(0);
    setMaxCombo(0);
    setLetterIndex(0);
    generateNewLetter();
  };

  // 重置游戏
  const resetGame = () => {
    setGameStarted(false);
    setShowInstructions(true);
    setCurrentLetter('');
    setCurrentFinger('');
    setScore(0);
    setCorrectKeys(0);
    setTotalKeys(0);
    setCombo(0);
    setMaxCombo(0);
    setLetterIndex(0);
    setPressedKeys(new Set());
    setAnimatingKeys(new Set());
    setErrorKeys(new Set());
  };

  // 计算准确率
  const accuracy = totalKeys > 0 ? Math.round((correctKeys / totalKeys) * 100) : 100;

  return (
    <div className="h-screen overflow-hidden p-1" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      {/* 添加CSS动画 */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        .floating-penguin {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* 返回按钮 */}
        <div className="mb-1">
          <button
            onClick={onBack}
            className="bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm text-sm"
          >
            ← 返回主页
          </button>
        </div>

        {/* 标题区域 */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center">
            <img 
              src="/images/penguins/penguin_front_view.png" 
              alt="指法练习企鹅" 
              className="w-8 h-8 mr-2 floating-penguin"
            />
            <h1 className="text-xl font-bold text-white">
              🎹 指法练习游戏
            </h1>
            <img 
              src="/images/penguins/penguin_side_view.png" 
              alt="指法练习企鹅" 
              className="w-8 h-8 ml-2 floating-penguin"
            />
          </div>
        </div>

        {/* 说明界面 */}
        {showInstructions && (
          <div className="bg-white rounded-xl p-4 shadow-2xl flex-1 overflow-auto">
            <h2 className="text-lg font-bold text-center mb-3 text-gray-800">
              🐧 指法练习说明
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">🌈 手指颜色对应</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{backgroundColor: FINGER_COLORS['left-pinky']}}></div>
                    <span className="text-xs">小指 - 红色</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{backgroundColor: FINGER_COLORS['left-ring']}}></div>
                    <span className="text-xs">无名指 - 青色</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{backgroundColor: FINGER_COLORS['left-middle']}}></div>
                    <span className="text-xs">中指 - 蓝色</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{backgroundColor: FINGER_COLORS['left-index']}}></div>
                    <span className="text-xs">食指 - 绿色</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{backgroundColor: FINGER_COLORS['left-thumb']}}></div>
                    <span className="text-xs">拇指 - 黄色</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">🎮 游戏规则</h3>
                <ul className="space-y-1 text-gray-600 text-xs">
                  <li>• 练习单个字母，逐步提高</li>
                  <li>• 蓝色光圈表示当前需要按的键</li>
                  <li>• 左右手图形显示正确手指位置</li>
                  <li>• 正确按键会有绿色成功动画</li>
                  <li>• 错误按键会有红色震动动画</li>
                  <li>• 连续正确按键可获得连击奖励</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                🚀 开始练习
              </button>
            </div>
          </div>
        )}

        {/* 游戏界面 */}
        {gameStarted && (
          <div className="flex-1 flex flex-col space-y-1">
            {/* 游戏状态 - 超紧凑版 */}
            <div className="bg-white rounded-xl p-2 shadow-xl">
              <div className="grid grid-cols-5 gap-1 text-center">
                <div>
                  <div className="text-base font-bold text-blue-600">{score}</div>
                  <div className="text-xs text-gray-600">得分</div>
                </div>
                <div>
                  <div className="text-base font-bold text-green-600">{accuracy}%</div>
                  <div className="text-xs text-gray-600">准确率</div>
                </div>
                <div>
                  <div className="text-base font-bold text-purple-600">{combo}</div>
                  <div className="text-xs text-gray-600">连击</div>
                </div>
                <div>
                  <div className="text-base font-bold text-orange-600">{maxCombo}</div>
                  <div className="text-xs text-gray-600">最高连击</div>
                </div>
                <div>
                  <button
                    onClick={resetGame}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                  >
                    重新开始
                  </button>
                </div>
              </div>
            </div>

            {/* 键盘区域 - 练习内容直接在键盘上方 */}
            <div className="bg-white rounded-xl p-2 shadow-xl flex-1">
              {/* 练习内容 - 内容和提示在一行，节省垂直空间 */}
              <div className="text-center mb-1">
                <div className="flex justify-center items-center space-x-4">
                  {/* 练习字母 */}
                  <div className="practice-content text-3xl font-mono bg-gray-100 p-2 rounded-lg">
                    <span className="text-blue-600 animate-pulse font-bold">
                      {currentLetter === ' ' ? '空格' : currentLetter.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* 手指提示和连击 */}
                  <div className="flex items-center space-x-2">
                    <span 
                      className="px-3 py-2 rounded-full text-white font-bold text-sm"
                      style={{backgroundColor: currentFinger ? FINGER_COLORS[currentFinger] : '#gray'}}
                    >
                      {FINGER_NAMES[currentFinger] || ''}
                    </span>
                    
                    {combo > 0 && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full font-bold animate-pulse text-sm">
                        🔥 x{combo}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 键盘 - 直接在练习内容下方，无间距 */}
              <div className="keyboard-container">
                {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                  <div key={rowIndex} className="keyboard-row">
                    {row.map((key) => (
                      <div
                        key={key}
                        style={getKeyStyle(key)}
                        className="select-none"
                      >
                        {key === 'Space' ? '空格' : key}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 左右手显示区域 - 超紧凑版 */}
            <div className="bg-white rounded-xl p-1 shadow-xl">
              <div className="grid grid-cols-2 gap-1">
                <div className="hand-display">
                  <LeftHandDisplay />
                </div>
                <div className="hand-display">
                  <RightHandDisplay />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FingerPracticeGame;

