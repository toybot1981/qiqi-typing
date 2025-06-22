import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Lock, Globe } from 'lucide-react';
import { lessons, getLessonsByLanguage } from '../data/lessons';
import { useApp } from '../context/AppContext';

const LessonSelectPage = ({ onBack, onSelectLesson, userProgress }) => {
  const { state, actions } = useApp();
  const { lastSelectedLanguage, lastSelectedLessonType } = state;
  
  // 使用保存的状态或默认值
  const [selectedLanguage, setSelectedLanguage] = useState(lastSelectedLanguage || 'chinese');
  const [selectedLesson, setSelectedLesson] = useState(lastSelectedLessonType || null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const { english, chinese } = getLessonsByLanguage();
  const currentLessons = selectedLanguage === 'chinese' ? chinese : english;

  // 检查关卡是否解锁
  const isLevelUnlocked = (lessonType, levelIndex) => {
    if (levelIndex === 0) return true; // 第一个关卡总是解锁的
    
    const prevLevelId = lessons[lessonType].levels[levelIndex - 1].id;
    return userProgress?.completedLevels?.includes(prevLevelId) || false;
  };

  // 获取关卡完成状态
  const getLevelProgress = (levelId) => {
    return userProgress?.levelStats?.[levelId] || null;
  };

  // 开始练习
  const handleStartPractice = () => {
    if (selectedLesson && selectedLevel) {
      onSelectLesson(selectedLesson, selectedLevel.id);
    }
  };

  // 切换语言时保存状态
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setSelectedLesson(null);
    setSelectedLevel(null);
    // 保存选择状态
    actions.setSelectionState(language, null);
  };

  // 选择课程类型时保存状态
  const handleLessonSelect = (lessonType) => {
    setSelectedLesson(lessonType);
    setSelectedLevel(null);
    // 保存选择状态
    actions.setSelectionState(selectedLanguage, lessonType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 头部导航 */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">选择练习内容</h1>
            <p className="text-sm text-gray-600 mt-1">完成一个阶段后可以继续挑战下一阶段</p>
          </div>
          <div className="w-24"></div> {/* 占位符保持居中 */}
        </div>

        {/* 语言选择 */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={selectedLanguage === 'chinese' ? 'default' : 'ghost'}
              onClick={() => handleLanguageChange('chinese')}
              className="flex items-center gap-2"
            >
              🇨🇳 语文练习
            </Button>
            <Button
              variant={selectedLanguage === 'english' ? 'default' : 'ghost'}
              onClick={() => handleLanguageChange('english')}
              className="flex items-center gap-2"
            >
              🇺🇸 英文练习
            </Button>
          </div>
        </div>

        {/* 语文练习说明 */}
        {selectedLanguage === 'chinese' && (
          <Card className="bg-gradient-to-r from-red-50 to-yellow-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="font-semibold text-red-800">4-5年级语文打字练习</h3>
                  <p className="text-red-700 text-sm">
                    结合语文学习内容，练习汉字、词语、句子和古诗，让打字练习更有意义！
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：练习类型选择 */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedLanguage === 'chinese' ? '语文练习类型' : '英文练习类型'}
            </h2>
            
            {Object.values(currentLessons).map((lesson) => (
              <Card 
                key={lesson.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedLesson === lesson.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleLessonSelect(lesson.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{lesson.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                      {lesson.type === 'chinese' && (
                        <Badge variant="secondary" className="mt-1 bg-red-100 text-red-800 text-xs">
                          语文内容
                        </Badge>
                      )}
                    </div>
                    {selectedLesson === lesson.id && (
                      <div className="text-blue-500">✓</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 右侧：关卡选择 */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  选择关卡 - {lessons[selectedLesson].title}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lessons[selectedLesson].levels.map((level, index) => {
                    const isUnlocked = isLevelUnlocked(selectedLesson, index);
                    const progress = getLevelProgress(level.id);
                    const isCompleted = progress !== null;
                    
                    return (
                      <Card 
                        key={level.id}
                        className={`cursor-pointer transition-all duration-300 ${
                          !isUnlocked 
                            ? 'opacity-50 cursor-not-allowed' 
                            : selectedLevel?.id === level.id
                              ? 'ring-2 ring-green-500 bg-green-50 hover:shadow-lg'
                              : 'hover:shadow-lg hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (isUnlocked) {
                            setSelectedLevel(level);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                              {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                              {level.title}
                            </h3>
                            {isCompleted && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                已完成
                              </Badge>
                            )}
                          </div>
                          
                          {level.description && (
                            <p className="text-xs text-gray-600 mb-2">{level.description}</p>
                          )}
                          
                          {isCompleted && progress && (
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>最佳速度: {progress.bestWPM} WPM</div>
                              <div>最高准确率: {progress.bestAccuracy}%</div>
                            </div>
                          )}
                          
                          {!isUnlocked && (
                            <p className="text-xs text-gray-500 mt-2">
                              完成上一关卡解锁
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* 开始练习按钮 */}
                {selectedLevel && (
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        准备开始练习
                      </h3>
                      <p className="text-gray-600 mb-1 font-medium">
                        {selectedLevel.title}
                      </p>
                      {selectedLevel.description && (
                        <p className="text-gray-500 text-sm mb-4">
                          {selectedLevel.description}
                        </p>
                      )}
                      <p className="text-gray-600 mb-4">
                        本次练习包含 {selectedLevel.content?.length || 10} 个内容
                      </p>
                      <Button 
                        onClick={handleStartPractice}
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        开始练习
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="text-4xl mb-4">
                    {selectedLanguage === 'chinese' ? '📚' : '👈'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {selectedLanguage === 'chinese' ? '请选择语文练习类型' : '请选择练习类型'}
                  </h3>
                  <p className="text-gray-500">
                    从左侧选择一个你想要练习的类型
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonSelectPage;

