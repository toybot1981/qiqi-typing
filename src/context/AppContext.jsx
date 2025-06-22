import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { checkAchievements } from '../data/achievements';

// 创建上下文
const AppContext = createContext();

// 初始状态
const initialState = {
  userStats: {
    totalPoints: 0,
    totalPractices: 0,
    currentStreak: 0,
    lastPracticeDate: null,
    unlockedAchievements: [],
    lessonTypes: [],
    levelStats: {},
    completedLevels: []
  },
  currentPage: 'welcome', // welcome, lessonSelect, practice, progress
  currentLesson: null,
  currentLevel: null,
  // 新增：保持选择状态
  lastSelectedLanguage: null, // 'chinese' 或 'english'
  lastSelectedLessonType: null // 具体的练习类型
};

// 动作类型
const actionTypes = {
  SET_PAGE: 'SET_PAGE',
  SET_LESSON: 'SET_LESSON',
  COMPLETE_PRACTICE: 'COMPLETE_PRACTICE',
  LOAD_USER_DATA: 'LOAD_USER_DATA',
  RESET_USER_DATA: 'RESET_USER_DATA',
  SET_SELECTION_STATE: 'SET_SELECTION_STATE' // 新增：保存选择状态
};

// 减速器函数
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };

    case actionTypes.SET_LESSON:
      // 确定语言类型
      const language = ['characters', 'words', 'sentences', 'poems', 'idioms'].includes(action.payload.lessonType) 
        ? 'chinese' 
        : 'english';
      
      return {
        ...state,
        currentLesson: action.payload.lessonType,
        currentLevel: action.payload.levelId,
        // 保存选择状态
        lastSelectedLanguage: language,
        lastSelectedLessonType: action.payload.lessonType
      };

    case actionTypes.SET_SELECTION_STATE:
      return {
        ...state,
        lastSelectedLanguage: action.payload.language,
        lastSelectedLessonType: action.payload.lessonType
      };

    case actionTypes.COMPLETE_PRACTICE:
      const { practiceStats, lessonType, levelId } = action.payload;
      const newUserStats = { ...state.userStats };
      
      // 更新基础统计
      newUserStats.totalPractices += 1;
      newUserStats.totalPoints += practiceStats.score || 0;
      
      // 更新练习类型
      if (!newUserStats.lessonTypes.includes(lessonType)) {
        newUserStats.lessonTypes.push(lessonType);
      }
      
      // 更新关卡统计
      const currentLevelStats = newUserStats.levelStats[levelId] || {
        attempts: 0,
        bestWPM: 0,
        bestAccuracy: 0,
        totalScore: 0
      };
      
      currentLevelStats.attempts += 1;
      currentLevelStats.bestWPM = Math.max(currentLevelStats.bestWPM, practiceStats.wpm);
      currentLevelStats.bestAccuracy = Math.max(currentLevelStats.bestAccuracy, practiceStats.accuracy);
      currentLevelStats.totalScore += practiceStats.score || 0;
      
      newUserStats.levelStats[levelId] = currentLevelStats;
      
      // 标记关卡为已完成
      if (!newUserStats.completedLevels.includes(levelId)) {
        newUserStats.completedLevels.push(levelId);
      }
      
      // 更新连续练习天数
      const today = new Date().toDateString();
      const lastDate = newUserStats.lastPracticeDate;
      
      if (lastDate === today) {
        // 今天已经练习过，不改变连续天数
      } else if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
        // 昨天练习过，连续天数+1
        newUserStats.currentStreak += 1;
      } else {
        // 中断了，重新开始
        newUserStats.currentStreak = 1;
      }
      
      newUserStats.lastPracticeDate = today;
      
      // 检查新成就
      const newAchievements = checkAchievements(practiceStats, newUserStats);
      newAchievements.forEach(achievement => {
        if (!newUserStats.unlockedAchievements.includes(achievement.id)) {
          newUserStats.unlockedAchievements.push(achievement.id);
          newUserStats.totalPoints += achievement.points;
        }
      });
      
      return {
        ...state,
        userStats: newUserStats
      };

    case actionTypes.LOAD_USER_DATA:
      return {
        ...state,
        userStats: { ...initialState.userStats, ...action.payload }
      };

    case actionTypes.RESET_USER_DATA:
      return {
        ...state,
        userStats: { ...initialState.userStats }
      };

    default:
      return state;
  }
};

// 上下文提供者组件
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 从本地存储加载数据
  useEffect(() => {
    const savedData = localStorage.getItem('typingTutorUserData');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        dispatch({ type: actionTypes.LOAD_USER_DATA, payload: userData });
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    }
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('typingTutorUserData', JSON.stringify(state.userStats));
  }, [state.userStats]);

  // 动作创建器
  const actions = {
    setPage: (page) => dispatch({ type: actionTypes.SET_PAGE, payload: page }),
    
    setLesson: (lessonType, levelId) => dispatch({ 
      type: actionTypes.SET_LESSON, 
      payload: { lessonType, levelId } 
    }),
    
    setSelectionState: (language, lessonType) => dispatch({
      type: actionTypes.SET_SELECTION_STATE,
      payload: { language, lessonType }
    }),
    
    completePractice: (practiceStats, lessonType, levelId) => dispatch({
      type: actionTypes.COMPLETE_PRACTICE,
      payload: { practiceStats, lessonType, levelId }
    }),
    
    resetUserData: () => {
      localStorage.removeItem('typingTutorUserData');
      dispatch({ type: actionTypes.RESET_USER_DATA });
    }
  };

  const value = {
    state,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义钩子
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

