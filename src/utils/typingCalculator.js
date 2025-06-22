// 打字统计计算工具
export class TypingCalculator {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.totalCharacters = 0;
    this.correctCharacters = 0;
    this.errors = 0;
  }

  // 开始计时
  start() {
    this.startTime = Date.now();
    this.endTime = null;
    this.totalCharacters = 0;
    this.correctCharacters = 0;
    this.errors = 0;
  }

  // 结束计时
  end() {
    this.endTime = Date.now();
  }

  // 记录输入字符
  recordInput(isCorrect) {
    this.totalCharacters++;
    if (isCorrect) {
      this.correctCharacters++;
    } else {
      this.errors++;
    }
  }

  // 计算打字速度 (WPM - Words Per Minute)
  getWPM() {
    if (!this.startTime || !this.endTime) return 0;
    
    const timeInMinutes = (this.endTime - this.startTime) / (1000 * 60);
    if (timeInMinutes === 0) return 0;
    
    // 假设平均每个单词5个字符
    const words = this.correctCharacters / 5;
    return Math.round(words / timeInMinutes);
  }

  // 计算准确率
  getAccuracy() {
    if (this.totalCharacters === 0) return 100;
    return Math.round((this.correctCharacters / this.totalCharacters) * 100);
  }

  // 获取用时（秒）
  getTimeSpent() {
    if (!this.startTime || !this.endTime) return 0;
    return Math.round((this.endTime - this.startTime) / 1000);
  }

  // 获取完整统计信息
  getStats() {
    return {
      wpm: this.getWPM(),
      accuracy: this.getAccuracy(),
      timeSpent: this.getTimeSpent(),
      totalCharacters: this.totalCharacters,
      correctCharacters: this.correctCharacters,
      errors: this.errors
    };
  }

  // 重置统计
  reset() {
    this.startTime = null;
    this.endTime = null;
    this.totalCharacters = 0;
    this.correctCharacters = 0;
    this.errors = 0;
  }
}

// 计算积分
export const calculateScore = (stats) => {
  const { wpm, accuracy, timeSpent } = stats;
  
  // 基础分数：WPM * 准确率
  let score = wpm * (accuracy / 100);
  
  // 时间奖励：练习时间越长，奖励越多（最多2倍）
  const timeBonus = Math.min(timeSpent / 60, 2);
  score *= (1 + timeBonus * 0.5);
  
  // 准确率奖励：准确率超过90%有额外奖励
  if (accuracy >= 90) {
    score *= 1.2;
  }
  if (accuracy >= 95) {
    score *= 1.3;
  }
  if (accuracy === 100) {
    score *= 1.5;
  }
  
  return Math.round(score);
};

// 评估打字水平
export const getTypingLevel = (wpm) => {
  if (wpm >= 60) return { level: '专家', color: 'text-purple-600', emoji: '🏆' };
  if (wpm >= 40) return { level: '高级', color: 'text-blue-600', emoji: '⭐' };
  if (wpm >= 25) return { level: '中级', color: 'text-green-600', emoji: '👍' };
  if (wpm >= 15) return { level: '初级', color: 'text-yellow-600', emoji: '🌟' };
  return { level: '新手', color: 'text-gray-600', emoji: '🌱' };
};

