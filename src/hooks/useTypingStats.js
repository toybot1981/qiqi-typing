import { useState, useEffect, useCallback } from 'react';

// 打字统计钩子
export const useTypingStats = () => {
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    timeSpent: 0,
    totalCharacters: 0,
    correctCharacters: 0,
    errors: 0
  });
  
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // 开始计时
  const start = useCallback(() => {
    setStartTime(Date.now());
    setIsActive(true);
    setStats({
      wpm: 0,
      accuracy: 100,
      timeSpent: 0,
      totalCharacters: 0,
      correctCharacters: 0,
      errors: 0
    });
  }, []);

  // 结束计时
  const end = useCallback(() => {
    setIsActive(false);
  }, []);

  // 记录输入
  const recordInput = useCallback((isCorrect) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        totalCharacters: prev.totalCharacters + 1,
        correctCharacters: prev.correctCharacters + (isCorrect ? 1 : 0),
        errors: prev.errors + (isCorrect ? 0 : 1)
      };
      
      // 计算准确率
      newStats.accuracy = newStats.totalCharacters > 0 
        ? Math.round((newStats.correctCharacters / newStats.totalCharacters) * 100)
        : 100;
      
      return newStats;
    });
  }, []);

  // 重置统计
  const reset = useCallback(() => {
    setStats({
      wpm: 0,
      accuracy: 100,
      timeSpent: 0,
      totalCharacters: 0,
      correctCharacters: 0,
      errors: 0
    });
    setIsActive(false);
    setStartTime(null);
  }, []);

  // 检测是否为中文字符
  const isChinese = (char) => {
    return /[\u4e00-\u9fff]/.test(char);
  };

  // 更新时间和WPM
  useEffect(() => {
    let interval = null;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const timeSpent = Math.round((now - startTime) / 1000);
        
        setStats(prev => {
          const timeInMinutes = timeSpent / 60;
          let wpm = 0;
          
          if (timeInMinutes > 0) {
            // 对于中文，直接使用字符数作为"词数"
            // 对于英文，使用传统的5字符=1词的计算方式
            // 这里简化处理，直接使用字符数
            wpm = Math.round(prev.correctCharacters / timeInMinutes);
          }
          
          return {
            ...prev,
            timeSpent,
            wpm
          };
        });
      }, 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  return {
    stats,
    isActive,
    start,
    end,
    recordInput,
    reset
  };
};

// 计时器钩子
export const useTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setTime(initialTime);
    setIsRunning(false);
  };

  return { time, isRunning, start, pause, reset };
};

