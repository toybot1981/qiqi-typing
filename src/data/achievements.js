// 成就系统数据
export const achievements = [
  // 速度成就
  {
    id: 'speed_10',
    title: '小小新手',
    description: '打字速度达到10 WPM',
    icon: '🌱',
    condition: (stats) => stats.wpm >= 10,
    points: 50
  },
  {
    id: 'speed_20',
    title: '进步之星',
    description: '打字速度达到20 WPM',
    icon: '⭐',
    condition: (stats) => stats.wpm >= 20,
    points: 100
  },
  {
    id: 'speed_30',
    title: '打字能手',
    description: '打字速度达到30 WPM',
    icon: '🏃',
    condition: (stats) => stats.wpm >= 30,
    points: 200
  },
  {
    id: 'speed_40',
    title: '键盘高手',
    description: '打字速度达到40 WPM',
    icon: '🚀',
    condition: (stats) => stats.wpm >= 40,
    points: 300
  },
  {
    id: 'speed_50',
    title: '打字专家',
    description: '打字速度达到50 WPM',
    icon: '🏆',
    condition: (stats) => stats.wpm >= 50,
    points: 500
  },

  // 准确率成就
  {
    id: 'accuracy_90',
    title: '细心宝贝',
    description: '准确率达到90%',
    icon: '🎯',
    condition: (stats) => stats.accuracy >= 90,
    points: 100
  },
  {
    id: 'accuracy_95',
    title: '精准射手',
    description: '准确率达到95%',
    icon: '🏹',
    condition: (stats) => stats.accuracy >= 95,
    points: 200
  },
  {
    id: 'accuracy_100',
    title: '完美主义者',
    description: '准确率达到100%',
    icon: '💎',
    condition: (stats) => stats.accuracy === 100,
    points: 300
  },

  // 练习次数成就
  {
    id: 'practice_5',
    title: '勤奋学习',
    description: '完成5次练习',
    icon: '📚',
    condition: (userStats) => userStats.totalPractices >= 5,
    points: 100
  },
  {
    id: 'practice_10',
    title: '坚持不懈',
    description: '完成10次练习',
    icon: '💪',
    condition: (userStats) => userStats.totalPractices >= 10,
    points: 200
  },
  {
    id: 'practice_25',
    title: '学习达人',
    description: '完成25次练习',
    icon: '🎓',
    condition: (userStats) => userStats.totalPractices >= 25,
    points: 500
  },
  {
    id: 'practice_50',
    title: '打字大师',
    description: '完成50次练习',
    icon: '👑',
    condition: (userStats) => userStats.totalPractices >= 50,
    points: 1000
  },

  // 连续练习成就
  {
    id: 'streak_3',
    title: '三天坚持',
    description: '连续3天练习',
    icon: '🔥',
    condition: (userStats) => userStats.currentStreak >= 3,
    points: 150
  },
  {
    id: 'streak_7',
    title: '一周坚持',
    description: '连续7天练习',
    icon: '🌟',
    condition: (userStats) => userStats.currentStreak >= 7,
    points: 300
  },
  {
    id: 'streak_14',
    title: '两周坚持',
    description: '连续14天练习',
    icon: '🏅',
    condition: (userStats) => userStats.currentStreak >= 14,
    points: 600
  },

  // 特殊成就
  {
    id: 'first_practice',
    title: '初次尝试',
    description: '完成第一次练习',
    icon: '🎉',
    condition: (userStats) => userStats.totalPractices >= 1,
    points: 50
  },
  {
    id: 'all_lessons',
    title: '全能选手',
    description: '尝试所有类型的练习',
    icon: '🌈',
    condition: (userStats) => {
      const types = ['letters', 'words', 'sentences', 'numbers'];
      return types.every(type => userStats.lessonTypes?.includes(type));
    },
    points: 400
  },
  {
    id: 'speed_accuracy',
    title: '速度与激情',
    description: '单次练习速度超过30 WPM且准确率超过95%',
    icon: '⚡',
    condition: (stats) => stats.wpm >= 30 && stats.accuracy >= 95,
    points: 400
  }
];

// 检查用户获得的成就
export const checkAchievements = (practiceStats, userStats) => {
  const newAchievements = [];
  
  achievements.forEach(achievement => {
    // 检查是否已经获得过这个成就
    if (userStats.unlockedAchievements?.includes(achievement.id)) {
      return;
    }
    
    // 检查成就条件
    let conditionMet = false;
    
    if (achievement.condition.length === 1) {
      // 单次练习成就
      conditionMet = achievement.condition(practiceStats);
    } else {
      // 累计成就
      conditionMet = achievement.condition(userStats);
    }
    
    if (conditionMet) {
      newAchievements.push(achievement);
    }
  });
  
  return newAchievements;
};

// 获取成就等级
export const getAchievementLevel = (totalPoints) => {
  if (totalPoints >= 5000) return { level: '传奇大师', color: 'text-purple-600', emoji: '👑' };
  if (totalPoints >= 3000) return { level: '打字专家', color: 'text-gold-600', emoji: '🏆' };
  if (totalPoints >= 2000) return { level: '键盘高手', color: 'text-blue-600', emoji: '🚀' };
  if (totalPoints >= 1000) return { level: '进步之星', color: 'text-green-600', emoji: '⭐' };
  if (totalPoints >= 500) return { level: '勤奋学习', color: 'text-yellow-600', emoji: '📚' };
  return { level: '新手上路', color: 'text-gray-600', emoji: '🌱' };
};

