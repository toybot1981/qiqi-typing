import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, BarChart3, Star, Heart, Sparkles } from 'lucide-react';

const WelcomePage = ({ onStartPractice, onViewProgress, onStartFingerPractice, userStats }) => {
  return (
    <div className="penguin-bg p-4 relative overflow-hidden">
      {/* 可爱的背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">🌟</div>
        <div className="absolute top-20 right-20 text-4xl animate-pulse">🎈</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-300">🌈</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">⭐</div>
        <div className="absolute top-1/2 left-5 text-3xl animate-bounce delay-700">🦄</div>
        <div className="absolute top-1/3 right-5 text-3xl animate-pulse delay-1000">🎨</div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* 标题区域 */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <img 
              src="/images/penguins/penguin_side_view.png" 
              alt="企鹅" 
              className="w-16 h-16 animate-bounce"
            />
            <h1 className="penguin-title">
              小企打字通
            </h1>
            <img 
              src="/images/penguins/penguin_side_view.png" 
              alt="企鹅" 
              className="w-16 h-16 animate-bounce delay-300 scale-x-[-1]"
            />
          </div>
          
          <p className="text-xl text-gray-700 font-medium">
            🌟 让打字变得超级有趣！🌟
          </p>
          
          {/* 主要企鹅形象 */}
          <div className="flex justify-center my-8">
            <img 
              src="/images/penguins/penguin_full_body.png" 
              alt="小企鹅" 
              className="w-32 h-32 penguin-float hover:scale-110 transition-transform duration-300"
            />
          </div>
          <p className="text-lg text-gray-600">
            和小伙伴们一起学习打字，收集星星，解锁成就！
          </p>
        </div>

        {/* 统计卡片 */}
        {userStats && userStats.totalPractices > 0 && (
          <div className="penguin-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="penguin-stat-card">
                <div className="text-3xl">🏆</div>
                <div className="penguin-stat-number">{userStats.totalPoints}</div>
                <div className="penguin-stat-label">总积分</div>
              </div>
              <div className="penguin-stat-card">
                <div className="text-3xl">📚</div>
                <div className="penguin-stat-number">{userStats.totalPractices}</div>
                <div className="penguin-stat-label">练习次数</div>
              </div>
              <div className="penguin-stat-card">
                <div className="text-3xl">🎖️</div>
                <div className="penguin-stat-number">{userStats.unlockedAchievements?.length || 0}</div>
                <div className="penguin-stat-label">获得成就</div>
              </div>
            </div>
          </div>
        )}

        {/* 主要按钮 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={onStartPractice}
            className="penguin-button flex items-center gap-3 text-xl"
          >
            <Play className="w-6 h-6" />
            🐧 开始练习
            <Sparkles className="w-6 h-6" />
          </button>
          
          <button 
            onClick={onStartFingerPractice}
            className="penguin-button flex items-center gap-3 text-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <span className="text-2xl">🎹</span>
            指法练习
            <span className="text-2xl">✨</span>
          </button>
          
          <button 
            onClick={onViewProgress}
            className="penguin-button-secondary flex items-center gap-3 text-xl"
          >
            <BarChart3 className="w-6 h-6" />
            📊 查看进度
            <Star className="w-6 h-6" />
          </button>
        </div>

        {/* 特色介绍 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="penguin-card">
            <div className="flex items-center gap-3 text-blue-700 mb-4">
              <img 
                src="/images/penguins/penguin_thinking.png" 
                alt="思考企鹅" 
                className="w-12 h-12"
              />
              <h3 className="text-xl font-bold">游戏化学习</h3>
            </div>
            <p className="text-blue-600">
              🌟 收集星星获得积分<br/>
              🏆 解锁超酷成就徽章<br/>
              📈 实时查看进步情况
            </p>
          </div>

          <div className="penguin-card">
            <div className="flex items-center gap-3 text-pink-700 mb-4">
              <img 
                src="/images/penguins/penguin_surprised.png" 
                alt="惊喜企鹅" 
                className="w-12 h-12"
              />
              <h3 className="text-xl font-bold">语文同步学习</h3>
            </div>
            <p className="text-pink-600">
              📝 4-5年级汉字词语<br/>
              🎭 经典古诗词练习<br/>
              🌈 成语故事学习
            </p>
          </div>

          <div className="penguin-card">
            <div className="flex items-center gap-3 text-green-700 mb-4">
              <img 
                src="/images/penguins/penguin_front_view.png" 
                alt="专注企鹅" 
                className="w-12 h-12"
              />
              <h3 className="text-xl font-bold">智能键盘指导</h3>
            </div>
            <p className="text-green-600">
              👆 手指位置提示<br/>
              🎯 正确打字姿势<br/>
              ⚡ 提高打字速度
            </p>
          </div>

          <div className="penguin-card">
            <div className="flex items-center gap-3 text-purple-700 mb-4">
              <img 
                src="/images/penguins/penguin_happy.png" 
                alt="开心企鹅" 
                className="w-12 h-12"
              />
              <h3 className="text-xl font-bold">个性化体验</h3>
            </div>
            <p className="text-purple-600">
              🎪 可爱的企鹅陪伴<br/>
              🎵 有趣的音效反馈<br/>
              🌟 专属学习记录
            </p>
          </div>
        </div>

        {/* 底部鼓励语 */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-700">
            🎉 每天练习15分钟，成为打字小能手！🎉
          </p>
          <div className="flex justify-center gap-2 text-2xl">
            <span className="animate-bounce">💪</span>
            <span className="animate-bounce delay-100">🌟</span>
            <span className="animate-bounce delay-200">🚀</span>
            <span className="animate-bounce delay-300">🎯</span>
            <span className="animate-bounce delay-400">🏆</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

