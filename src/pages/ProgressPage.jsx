import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, BarChart3, Calendar, Award, Target, Clock, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Achievement, ScoreDisplay } from '../components/GameElements';
import { achievements, getAchievementLevel } from '../data/achievements';
import { lessons } from '../data/lessons';

const ProgressPage = ({ onBack, userStats }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // 计算总体统计
  const totalPoints = userStats?.totalPoints || 0;
  const totalPractices = userStats?.totalPractices || 0;
  const currentStreak = userStats?.currentStreak || 0;
  const unlockedAchievements = userStats?.unlockedAchievements || [];
  const levelStats = userStats?.levelStats || {};
  const completedLevels = userStats?.completedLevels || [];

  // 计算平均统计
  const avgWPM = Object.values(levelStats).length > 0 
    ? Math.round(Object.values(levelStats).reduce((sum, stat) => sum + stat.bestWPM, 0) / Object.values(levelStats).length)
    : 0;
  
  const avgAccuracy = Object.values(levelStats).length > 0
    ? Math.round(Object.values(levelStats).reduce((sum, stat) => sum + stat.bestAccuracy, 0) / Object.values(levelStats).length)
    : 0;

  // 获取用户等级
  const userLevel = getAchievementLevel(totalPoints);

  // 生成练习历史图表数据（模拟数据）
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // 模拟数据，实际应用中应该从真实数据生成
      const practiceCount = Math.floor(Math.random() * 5);
      const avgWPM = practiceCount > 0 ? Math.floor(Math.random() * 30) + 10 : 0;
      
      data.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        practices: practiceCount,
        wpm: avgWPM
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  // 按类型统计练习进度
  const getLessonProgress = () => {
    return Object.values(lessons).map(lesson => {
      const totalLevels = lesson.levels.length;
      const completedCount = lesson.levels.filter(level => 
        completedLevels.includes(level.id)
      ).length;
      
      const bestWPM = lesson.levels.reduce((max, level) => {
        const stats = levelStats[level.id];
        return stats ? Math.max(max, stats.bestWPM) : max;
      }, 0);

      return {
        ...lesson,
        totalLevels,
        completedCount,
        progress: totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0,
        bestWPM
      };
    });
  };

  const lessonProgress = getLessonProgress();

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
          
          <h1 className="text-2xl font-bold text-gray-800">学习进度</h1>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${userLevel.color} font-semibold`}>
              {userLevel.emoji} {userLevel.level}
            </Badge>
          </div>
        </div>

        {/* 标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              总览
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              成就
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              练习进度
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              历史记录
            </TabsTrigger>
          </TabsList>

          {/* 总览标签页 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 主要统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreDisplay 
                score={totalPoints} 
                label="总积分" 
                icon={Award} 
                color="purple" 
              />
              <ScoreDisplay 
                score={totalPractices} 
                label="练习次数" 
                icon={Target} 
                color="blue" 
              />
              <ScoreDisplay 
                score={currentStreak} 
                label="连续天数" 
                icon={Zap} 
                color="orange" 
              />
              <ScoreDisplay 
                score={unlockedAchievements.length} 
                label="获得成就" 
                icon={Trophy} 
                color="green" 
              />
            </div>

            {/* 技能统计 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    打字技能
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">平均速度</span>
                    <span className="text-2xl font-bold text-blue-600">{avgWPM} WPM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">平均准确率</span>
                    <span className="text-2xl font-bold text-green-600">{avgAccuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">完成关卡</span>
                    <span className="text-2xl font-bold text-purple-600">{completedLevels.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最近7天练习趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="practices" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="练习次数"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 成就标签页 */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                你已经获得了 {unlockedAchievements.length} 个成就！
              </h2>
              <p className="text-gray-600">
                继续练习解锁更多成就徽章
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <Achievement
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={unlockedAchievements.includes(achievement.id)}
                />
              ))}
            </div>
          </TabsContent>

          {/* 练习进度标签页 */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessonProgress.map(lesson => (
                <Card key={lesson.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{lesson.icon}</span>
                      <div>
                        <div>{lesson.title}</div>
                        <div className="text-sm font-normal text-gray-600">
                          {lesson.completedCount}/{lesson.totalLevels} 关卡完成
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">进度: {Math.round(lesson.progress)}%</span>
                      {lesson.bestWPM > 0 && (
                        <span className="text-blue-600">最佳: {lesson.bestWPM} WPM</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 历史记录标签页 */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>练习历史</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(levelStats).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(levelStats).map(([levelId, stats]) => {
                      // 找到对应的课程和关卡信息
                      let lessonInfo = null;
                      let levelInfo = null;
                      
                      Object.values(lessons).forEach(lesson => {
                        const level = lesson.levels.find(l => l.id === levelId);
                        if (level) {
                          lessonInfo = lesson;
                          levelInfo = level;
                        }
                      });

                      if (!lessonInfo || !levelInfo) return null;

                      return (
                        <div key={levelId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{lessonInfo.icon}</span>
                            <div>
                              <div className="font-semibold">{levelInfo.title}</div>
                              <div className="text-sm text-gray-600">{lessonInfo.title}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              练习 {stats.attempts} 次
                            </div>
                            <div className="font-semibold">
                              最佳: {stats.bestWPM} WPM, {stats.bestAccuracy}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      还没有练习记录
                    </h3>
                    <p className="text-gray-500">
                      开始练习后，这里会显示你的历史记录
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressPage;

