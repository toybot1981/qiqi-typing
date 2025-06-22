import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Clock, Target } from 'lucide-react';

const Achievement = ({ achievement, isUnlocked, progress }) => {
  return (
    <Card className={`transition-all duration-300 ${
      isUnlocked 
        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md' 
        : 'bg-gray-50 border-gray-200 opacity-75'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`text-3xl ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
            {achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${
                isUnlocked ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {achievement.title}
              </h3>
              {isUnlocked && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                  +{achievement.points}
                </Badge>
              )}
            </div>
            <p className={`text-sm ${
              isUnlocked ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {achievement.description}
            </p>
            {progress && (
              <div className="mt-2 text-xs text-gray-500">
                进度: {progress}
              </div>
            )}
          </div>
          {isUnlocked && (
            <div className="text-yellow-500">
              <Trophy className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ScoreDisplay = ({ score, label, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200"
  };

  return (
    <Card className={`${colorClasses[color]} border-2`}>
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-2xl font-bold mb-1">{score}</div>
        <div className="text-sm font-medium">{label}</div>
      </CardContent>
    </Card>
  );
};

const ProgressBar = ({ value, max, label, color = "blue" }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const LessonCard = ({ lesson, onClick, progress, isCompleted }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="text-4xl mb-3">{lesson.icon}</div>
        <h3 className="font-semibold text-gray-800 mb-2">{lesson.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
        
        {progress && (
          <div className="space-y-2">
            <ProgressBar 
              value={progress.completed} 
              max={progress.total} 
              label="完成进度"
              color="green"
            />
            {progress.bestWPM > 0 && (
              <div className="text-xs text-gray-600">
                最佳速度: {progress.bestWPM} WPM
              </div>
            )}
          </div>
        )}
        
        {isCompleted && (
          <Badge className="mt-2 bg-green-100 text-green-800">
            已完成
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export { Achievement, ScoreDisplay, ProgressBar, LessonCard };

