import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import WelcomePage from './pages/WelcomePage';
import LessonSelectPage from './pages/LessonSelectPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import FingerPracticeGame from './pages/FingerPracticeGame';
import './App.css';
import './penguin-theme.css';

// 主应用组件
const AppContent = () => {
  const { state, actions } = useApp();
  const { currentPage, currentLesson, currentLevel, userStats } = state;

  // 页面导航处理
  const handleStartPractice = () => {
    actions.setPage('lessonSelect');
  };

  const handleViewProgress = () => {
    actions.setPage('progress');
  };

  const handleStartFingerPractice = () => {
    actions.setPage('fingerPractice');
  };

  const handleBackToWelcome = () => {
    actions.setPage('welcome');
  };

  const handleSelectLesson = (lessonType, levelId) => {
    actions.setLesson(lessonType, levelId);
    actions.setPage('practice');
  };

  const handlePracticeComplete = (practiceStats) => {
    actions.completePractice(practiceStats, currentLesson, currentLevel);
    actions.setPage('lessonSelect');
  };

  const handleBackToLessonSelect = () => {
    actions.setPage('lessonSelect');
  };

  // 根据当前页面渲染对应组件
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'welcome':
        return (
          <WelcomePage
            onStartPractice={handleStartPractice}
            onViewProgress={handleViewProgress}
            onStartFingerPractice={handleStartFingerPractice}
            userStats={userStats}
          />
        );
      
      case 'lessonSelect':
        return (
          <LessonSelectPage
            onBack={handleBackToWelcome}
            onSelectLesson={handleSelectLesson}
            userProgress={userStats}
          />
        );
      
      case 'practice':
        return (
          <PracticePage
            lessonType={currentLesson}
            levelId={currentLevel}
            onBack={handleBackToLessonSelect}
            onComplete={handlePracticeComplete}
          />
        );
      
      case 'progress':
        return (
          <ProgressPage
            onBack={handleBackToWelcome}
            userStats={userStats}
          />
        );
      
      case 'fingerPractice':
        return (
          <FingerPracticeGame
            onBack={handleBackToWelcome}
          />
        );
      
      default:
        return (
          <WelcomePage
            onStartPractice={handleStartPractice}
            onViewProgress={handleViewProgress}
            onStartFingerPractice={handleStartFingerPractice}
            userStats={userStats}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
};

// 根应用组件
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

