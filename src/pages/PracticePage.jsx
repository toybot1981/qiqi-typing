import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Play } from 'lucide-react';
import TypingInput from '../components/TypingInput';
import { useTypingStats } from '../hooks/useTypingStats';
import { getRandomContent } from '../data/lessons';
import { calculateScore, getTypingLevel } from '../utils/typingCalculator';

const PracticePage = ({ 
  lessonType, 
  levelId, 
  onBack, 
  onComplete 
}) => {
  const [currentContent, setCurrentContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { stats, isActive, start, end, recordInput, reset } = useTypingStats();

  // 初始化练习内容
  useEffect(() => {
    const content = getRandomContent(lessonType, levelId, 10);
    setCurrentContent(content);
    setCurrentIndex(0);
    setIsStarted(false);
    setIsCompleted(false);
    reset();
  }, [lessonType, levelId, reset]);

  // 开始练习
  const handleStart = () => {
    setIsStarted(true);
    start();
  };

  // 重新开始
  const handleRestart = () => {
    const content = getRandomContent(lessonType, levelId, 10);
    setCurrentContent(content);
    setCurrentIndex(0);
    setIsStarted(false);
    setIsCompleted(false);
    reset();
  };

  // 处理输入变化
  const handleInputChange = (isCorrect, charIndex) => {
    recordInput(isCorrect);
  };

  // 处理单个内容完成
  const handleContentComplete = (success) => {
    if (success) {
      // 移动到下一个内容
      if (currentIndex < currentContent.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // 所有内容完成
        end();
        setIsCompleted(true);
        
        // 计算最终分数
        const finalStats = {
          ...stats,
          timeSpent: Math.round((Date.now() - (Date.now() - stats.timeSpent * 1000)) / 1000)
        };
        const score = calculateScore(finalStats);
        
        if (onComplete) {
          onComplete({
            ...finalStats,
            score,
            level: getTypingLevel(finalStats.wpm)
          });
        }
      }
    }
  };

  // 获取当前练习内容
  const getCurrentText = () => {
    return currentContent[currentIndex] || '';
  };

  if (currentContent.length === 0) {
    return (
      <div className="penguin-bg p-4">
        <div className="max-w-4xl mx-auto">
          <div className="penguin-card text-center">
            <img 
              src="/images/penguins/penguin_thinking.png" 
              alt="思考中的企鹅" 
              className="w-16 h-16 mx-auto mb-4 penguin-wiggle"
            />
            <p className="text-lg text-gray-600">小企鹅正在准备练习内容...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="penguin-bg p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 头部导航 */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="penguin-button flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          
          <div className="flex items-center gap-4">
            <div className="penguin-badge">
              {currentIndex + 1} / {currentContent.length}
            </div>
            <button 
              onClick={handleRestart}
              className="penguin-button-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重新开始
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        {isActive && (
          <div className="penguin-card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="penguin-stat-card">
                <div className="penguin-stat-number text-blue-600">{stats.wpm}</div>
                <div className="penguin-stat-label">WPM</div>
              </div>
              <div className="penguin-stat-card">
                <div className="penguin-stat-number text-green-600">{stats.accuracy}%</div>
                <div className="penguin-stat-label">准确率</div>
              </div>
              <div className="penguin-stat-card">
                <div className="penguin-stat-number text-purple-600">{stats.timeSpent}s</div>
                <div className="penguin-stat-label">用时</div>
              </div>
              <div className="penguin-stat-card">
                <div className="penguin-stat-number text-orange-600">{stats.errors}</div>
                <div className="penguin-stat-label">错误</div>
              </div>
            </div>
          </div>
        )}

        {/* 练习区域 */}
        {!isStarted ? (
          <div className="penguin-card text-center space-y-6">
            <h3 className="text-xl font-bold text-gray-800">准备开始练习</h3>
            <div className="flex justify-center">
              <img 
                src="/images/penguins/penguin_front_view.png" 
                alt="准备练习的企鹅" 
                className="w-20 h-20 penguin-bounce"
              />
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <p className="text-lg text-gray-700 mb-4">
                本次练习包含 <span className="font-bold text-blue-600">{currentContent.length}</span> 个内容
              </p>
              <p className="text-sm text-gray-600">
                点击开始按钮开始练习，尽量保持准确性和速度的平衡
              </p>
            </div>
            <button 
              onClick={handleStart}
              className="penguin-button flex items-center gap-2 mx-auto text-lg px-8 py-3"
            >
              <Play className="w-5 h-5" />
              开始练习
            </button>
          </div>
        ) : !isCompleted ? (
          <TypingInput
            targetText={getCurrentText()}
            onComplete={handleContentComplete}
            onInputChange={handleInputChange}
          />
        ) : (
          <div className="penguin-success text-center space-y-6">
            <h3 className="text-xl font-bold text-white">
              🎉 练习完成！
            </h3>
            
            {/* 成功企鹅动画 */}
            <div className="flex justify-center space-x-4">
              <img 
                src="/images/penguins/penguin_jumping.png" 
                alt="跳跃的企鹅" 
                className="w-20 h-20 penguin-bounce"
              />
              <img 
                src="/images/penguins/penguin_happy.png" 
                alt="开心的企鹅" 
                className="w-20 h-20 penguin-float"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="penguin-stat-card bg-white">
                <div className="penguin-stat-number text-blue-600">{stats.wpm}</div>
                <div className="penguin-stat-label">打字速度 (WPM)</div>
              </div>
              <div className="penguin-stat-card bg-white">
                <div className="penguin-stat-number text-green-600">{stats.accuracy}%</div>
                <div className="penguin-stat-label">准确率</div>
              </div>
              <div className="penguin-stat-card bg-white">
                <div className="penguin-stat-number text-purple-600">{stats.timeSpent}s</div>
                <div className="penguin-stat-label">总用时</div>
              </div>
              <div className="penguin-stat-card bg-white">
                <div className="penguin-stat-number text-orange-600">
                  {calculateScore(stats)}
                </div>
                <div className="penguin-stat-label">得分</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleRestart} 
                className="penguin-button-secondary"
              >
                再练一次
              </button>
              <button 
                onClick={onBack} 
                className="penguin-button"
              >
                选择下一阶段
              </button>
            </div>
            
            {/* 自动返回提示 */}
            <div className="text-sm text-white mt-4">
              <p>🎯 恭喜完成本阶段练习！</p>
              <p>点击"选择下一阶段"继续挑战更多内容</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;

