import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const TypingInput = ({ 
  targetText, 
  onComplete, 
  onInputChange, 
  className = "" 
}) => {
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);

  // 重置状态
  useEffect(() => {
    setUserInput('');
    setCurrentIndex(0);
    setErrors([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [targetText]);

  // 处理输入变化
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // 在输入法组合期间，允许任何输入，不进行长度限制和验证
    if (isComposing) {
      setUserInput(value);
      return;
    }
    
    // 非输入法状态下的处理
    const newIndex = value.length;
    
    // 检查是否超出目标文本长度
    if (newIndex > targetText.length) {
      return;
    }
    
    setUserInput(value);
    setCurrentIndex(newIndex);
    
    // 立即验证（适用于英文输入）
    if (newIndex > 0) {
      validateInput(value, newIndex);
    }
  };

  // 处理输入法组合开始（用于中文输入）
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 处理输入法组合结束（用于中文输入）
  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    const value = e.target.value;
    const newIndex = value.length;
    
    // 检查是否超出目标文本长度
    if (newIndex > targetText.length) {
      // 如果超出长度，截取到目标长度
      const truncatedValue = value.substring(0, targetText.length);
      setUserInput(truncatedValue);
      setCurrentIndex(targetText.length);
      if (targetText.length > 0) {
        validateInput(truncatedValue, targetText.length);
      }
      return;
    }
    
    setUserInput(value);
    setCurrentIndex(newIndex);
    
    // 验证输入法完成后的输入
    if (newIndex > 0) {
      validateInput(value, newIndex);
    }
  };

  // 验证输入的通用函数
  const validateInput = (value, newIndex) => {
    const currentChar = targetText[newIndex - 1];
    const inputChar = value[newIndex - 1];
    const isCorrect = currentChar === inputChar;
    
    // 更新错误列表
    setErrors(prev => {
      const newErrors = [...prev];
      if (!isCorrect && !newErrors.includes(newIndex - 1)) {
        newErrors.push(newIndex - 1);
      }
      return newErrors;
    });
    
    // 通知父组件
    if (onInputChange) {
      onInputChange(isCorrect, newIndex - 1);
    }
    
    // 检查是否完成
    if (value === targetText) {
      if (onComplete) {
        onComplete(true);
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    // 阻止某些默认行为
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  // 渲染目标文本，高亮当前位置和错误
  const renderTargetText = () => {
    return targetText.split('').map((char, index) => {
      let className = 'inline-block ';
      
      if (index < currentIndex) {
        // 已输入的字符
        if (errors.includes(index)) {
          className += 'bg-red-200 text-red-800';
        } else {
          className += 'bg-green-200 text-green-800';
        }
      } else if (index === currentIndex) {
        // 当前位置
        className += 'bg-blue-200 text-blue-800 animate-pulse';
      } else {
        // 未输入的字符
        className += 'text-gray-600';
      }
      
      return (
        <span key={index} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  // 计算进度
  const progress = targetText.length > 0 ? (currentIndex / targetText.length) * 100 : 0;

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-center text-lg">请输入下面的内容</CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 目标文本显示 */}
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-2xl leading-relaxed font-mono tracking-wide">
            {renderTargetText()}
          </div>
        </div>
        
        {/* 输入框 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            你的输入：
          </label>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
            className="w-full p-4 text-xl font-mono border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="在这里输入..."
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        
        {/* 统计信息 */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>进度: {currentIndex}/{targetText.length}</span>
          <span>错误: {errors.length}</span>
          <span>准确率: {currentIndex > 0 ? Math.round(((currentIndex - errors.length) / currentIndex) * 100) : 100}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypingInput;

