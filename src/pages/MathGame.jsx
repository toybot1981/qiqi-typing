import React, { useState, useEffect, useCallback } from 'react';

// 数学题目类型
const MATH_TYPES = {
  ADDITION: 'addition',
  SUBTRACTION: 'subtraction', 
  MULTIPLICATION: 'multiplication',
  DIVISION: 'division',
  FRACTION: 'fraction',
  DECIMAL: 'decimal',
  GEOMETRY: 'geometry'
};

// 年级难度配置
const GRADE_CONFIG = {
  4: {
    name: '四年级',
    types: [MATH_TYPES.ADDITION, MATH_TYPES.SUBTRACTION, MATH_TYPES.MULTIPLICATION, MATH_TYPES.DIVISION],
    ranges: { min: 1, max: 100 },
    color: '#FF6B6B'
  },
  5: {
    name: '五年级', 
    types: [MATH_TYPES.ADDITION, MATH_TYPES.SUBTRACTION, MATH_TYPES.MULTIPLICATION, MATH_TYPES.DIVISION, MATH_TYPES.FRACTION, MATH_TYPES.DECIMAL],
    ranges: { min: 1, max: 1000 },
    color: '#4ECDC4'
  },
  6: {
    name: '六年级',
    types: [MATH_TYPES.ADDITION, MATH_TYPES.SUBTRACTION, MATH_TYPES.MULTIPLICATION, MATH_TYPES.DIVISION, MATH_TYPES.FRACTION, MATH_TYPES.DECIMAL, MATH_TYPES.GEOMETRY],
    ranges: { min: 1, max: 10000 },
    color: '#45B7D1'
  }
};

// 几何题目库
const GEOMETRY_QUESTIONS = [
  { question: '正方形的周长公式是？', answer: '4a', explanation: '正方形四边相等，周长 = 4 × 边长' },
  { question: '长方形的面积公式是？', answer: 'ab', explanation: '长方形面积 = 长 × 宽' },
  { question: '圆的面积公式是？', answer: 'πr²', explanation: '圆的面积 = π × 半径²' },
  { question: '三角形的面积公式是？', answer: '½ah', explanation: '三角形面积 = ½ × 底 × 高' },
  { question: '正方形的面积公式是？', answer: 'a²', explanation: '正方形面积 = 边长²' }
];

const MathGame = ({ onBack }) => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);

  // 生成四则运算题目
  const generateArithmeticQuestion = useCallback((type, grade) => {
    const config = GRADE_CONFIG[grade];
    const { min, max } = config.ranges;
    
    let num1, num2, question, answer, explanation;
    
    switch (type) {
      case MATH_TYPES.ADDITION:
        num1 = Math.floor(Math.random() * max) + min;
        num2 = Math.floor(Math.random() * max) + min;
        question = `${num1} + ${num2} = ?`;
        answer = (num1 + num2).toString();
        explanation = `${num1} + ${num2} = ${answer}`;
        break;
        
      case MATH_TYPES.SUBTRACTION:
        num1 = Math.floor(Math.random() * max) + min;
        num2 = Math.floor(Math.random() * num1) + 1;
        question = `${num1} - ${num2} = ?`;
        answer = (num1 - num2).toString();
        explanation = `${num1} - ${num2} = ${answer}`;
        break;
        
      case MATH_TYPES.MULTIPLICATION:
        num1 = Math.floor(Math.random() * (grade === 4 ? 12 : 20)) + 1;
        num2 = Math.floor(Math.random() * (grade === 4 ? 12 : 20)) + 1;
        question = `${num1} × ${num2} = ?`;
        answer = (num1 * num2).toString();
        explanation = `${num1} × ${num2} = ${answer}`;
        break;
        
      case MATH_TYPES.DIVISION:
        num2 = Math.floor(Math.random() * (grade === 4 ? 12 : 20)) + 1;
        answer = Math.floor(Math.random() * (grade === 4 ? 12 : 20)) + 1;
        num1 = num2 * answer;
        question = `${num1} ÷ ${num2} = ?`;
        explanation = `${num1} ÷ ${num2} = ${answer}`;
        answer = answer.toString();
        break;
        
      case MATH_TYPES.FRACTION:
        if (Math.random() > 0.5) {
          // 分数加法
          const denom = Math.floor(Math.random() * 8) + 2;
          num1 = Math.floor(Math.random() * denom) + 1;
          num2 = Math.floor(Math.random() * denom) + 1;
          question = `${num1}/${denom} + ${num2}/${denom} = ?`;
          const resultNum = num1 + num2;
          answer = resultNum >= denom ? `${Math.floor(resultNum/denom)}${resultNum%denom > 0 ? ` ${resultNum%denom}/${denom}` : ''}` : `${resultNum}/${denom}`;
          explanation = `同分母分数相加：分子相加，分母不变`;
        } else {
          // 分数化简
          const nums = [4, 6, 8, 9, 10, 12, 15, 16, 18, 20];
          const denom = nums[Math.floor(Math.random() * nums.length)];
          const factors = [];
          for (let i = 2; i < denom; i++) {
            if (denom % i === 0) factors.push(i);
          }
          const factor = factors[Math.floor(Math.random() * factors.length)];
          num1 = factor;
          question = `化简分数 ${num1}/${denom} = ?`;
          const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
          const g = gcd(num1, denom);
          answer = `${num1/g}/${denom/g}`;
          explanation = `找最大公约数${g}，分子分母同时除以${g}`;
        }
        break;
        
      case MATH_TYPES.DECIMAL:
        if (Math.random() > 0.5) {
          // 小数加法
          num1 = (Math.random() * 10).toFixed(1);
          num2 = (Math.random() * 10).toFixed(1);
          question = `${num1} + ${num2} = ?`;
          answer = (parseFloat(num1) + parseFloat(num2)).toFixed(1);
          explanation = `小数点对齐，从右往左计算`;
        } else {
          // 小数乘法
          num1 = (Math.random() * 5 + 1).toFixed(1);
          num2 = Math.floor(Math.random() * 9) + 1;
          question = `${num1} × ${num2} = ?`;
          answer = (parseFloat(num1) * num2).toFixed(1);
          explanation = `小数乘整数，先按整数乘法计算，再点小数点`;
        }
        break;
        
      default:
        return generateArithmeticQuestion(MATH_TYPES.ADDITION, grade);
    }
    
    return { question, answer, explanation, type };
  }, []);

  // 生成几何题目
  const generateGeometryQuestion = useCallback(() => {
    const randomQuestion = GEOMETRY_QUESTIONS[Math.floor(Math.random() * GEOMETRY_QUESTIONS.length)];
    return {
      ...randomQuestion,
      type: MATH_TYPES.GEOMETRY
    };
  }, []);

  // 生成新题目
  const generateNewQuestion = useCallback(() => {
    if (!selectedGrade) return;
    
    const config = GRADE_CONFIG[selectedGrade];
    const availableTypes = config.types;
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    let newQuestion;
    if (randomType === MATH_TYPES.GEOMETRY) {
      newQuestion = generateGeometryQuestion();
    } else {
      newQuestion = generateArithmeticQuestion(randomType, selectedGrade);
    }
    
    setCurrentQuestion(newQuestion);
    setUserAnswer('');
    setFeedback('');
    setShowExplanation(false);
  }, [selectedGrade, generateArithmeticQuestion, generateGeometryQuestion]);

  // 检查答案
  const checkAnswer = useCallback(() => {
    if (!currentQuestion || !userAnswer.trim()) return;
    
    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    setTotalQuestions(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + (10 + streak * 2));
      setStreak(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
      setFeedback('🎉 正确！');
    } else {
      setStreak(0);
      setFeedback(`❌ 错误！正确答案是：${currentQuestion.answer}`);
    }
    
    setShowExplanation(true);
    
    // 2秒后生成新题目
    setTimeout(() => {
      if (gameActive) {
        generateNewQuestion();
      }
    }, 2000);
  }, [currentQuestion, userAnswer, streak, gameActive, generateNewQuestion]);

  // 处理输入
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  // 处理回车键
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showExplanation) {
      checkAnswer();
    }
  };

  // 开始游戏
  const startGame = () => {
    setGameStarted(true);
    setGameActive(true);
    setScore(0);
    setStreak(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setTimeLeft(60);
    generateNewQuestion();
  };

  // 游戏计时器
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  // 重新开始游戏
  const restartGame = () => {
    setGameStarted(false);
    setGameActive(false);
    setSelectedGrade(null);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 overflow-hidden">
      <style>{`
        .floating-number {
          animation: float 3s ease-in-out infinite;
        }
        
        .floating-number:nth-child(2) {
          animation-delay: -1s;
        }
        
        .floating-number:nth-child(3) {
          animation-delay: -2s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        .pulse-answer {
          animation: pulse 0.5s ease-in-out;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between mb-2 p-4">
          <button
            onClick={onBack}
            className="bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm text-sm"
          >
            ← 返回主页
          </button>
          
          <div className="flex items-center">
            <span className="text-4xl mr-2 floating-number">🧮</span>
            <h1 className="text-xl font-bold text-white">
              🎯 数学趣味游戏
            </h1>
            <span className="text-4xl ml-2 floating-number">📊</span>
          </div>
          
          <div className="w-20"></div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 px-4 pb-4">
          {!selectedGrade ? (
            // 年级选择界面
            <div className="bg-white rounded-xl p-6 shadow-2xl h-full flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🎓 选择你的年级
                </h2>
                <p className="text-gray-600">
                  选择适合你的年级，开始数学打字冒险！
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 max-w-2xl">
                {Object.entries(GRADE_CONFIG).map(([grade, config]) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(parseInt(grade))}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all transform hover:scale-105"
                    style={{ borderColor: config.color }}
                  >
                    <div className="text-center">
                      <div 
                        className="text-4xl font-bold mb-2"
                        style={{ color: config.color }}
                      >
                        {grade}
                      </div>
                      <div className="text-lg font-semibold text-gray-800 mb-2">
                        {config.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {config.types.length} 种题型
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-blue-50 rounded-lg p-4 max-w-md">
                  <h3 className="font-semibold text-blue-800 mb-2">🎮 游戏规则</h3>
                  <ul className="text-sm text-blue-700 text-left space-y-1">
                    <li>• 60秒内答对尽可能多的题目</li>
                    <li>• 连续答对可获得额外分数</li>
                    <li>• 用键盘输入答案，按回车确认</li>
                    <li>• 练习打字的同时学习数学</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : !gameStarted ? (
            // 游戏准备界面
            <div className="bg-white rounded-xl p-6 shadow-2xl h-full flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🚀 准备开始 {GRADE_CONFIG[selectedGrade].name} 数学游戏
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-800 mb-2">题目类型：</h3>
                  <div className="flex flex-wrap gap-2">
                    {GRADE_CONFIG[selectedGrade].types.map(type => (
                      <span 
                        key={type}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        {type === 'addition' && '加法'}
                        {type === 'subtraction' && '减法'}
                        {type === 'multiplication' && '乘法'}
                        {type === 'division' && '除法'}
                        {type === 'fraction' && '分数'}
                        {type === 'decimal' && '小数'}
                        {type === 'geometry' && '几何'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedGrade(null)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  重新选择年级
                </button>
                <button
                  onClick={startGame}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-bold text-lg"
                >
                  🎯 开始游戏
                </button>
              </div>
            </div>
          ) : (
            // 游戏界面
            <div className="bg-white rounded-xl p-4 shadow-2xl h-full flex flex-col">
              {/* 游戏状态栏 */}
              <div className="grid grid-cols-5 gap-4 mb-4 text-center">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-blue-800">得分</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-2xl font-bold text-green-600">{streak}</div>
                  <div className="text-sm text-green-800">连击</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2">
                  <div className="text-2xl font-bold text-purple-600">{timeLeft}</div>
                  <div className="text-sm text-purple-800">剩余时间</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-2">
                  <div className="text-2xl font-bold text-orange-600">{totalQuestions}</div>
                  <div className="text-sm text-orange-800">总题数</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-2">
                  <div className="text-2xl font-bold text-pink-600">
                    {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                  </div>
                  <div className="text-sm text-pink-800">正确率</div>
                </div>
              </div>

              {gameActive ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  {currentQuestion && (
                    <div className="text-center max-w-2xl">
                      {/* 题目显示 */}
                      <div className="bg-gray-50 rounded-xl p-8 mb-6">
                        <div className="text-3xl font-bold text-gray-800 mb-4">
                          {currentQuestion.question}
                        </div>
                        
                        {/* 答案输入 */}
                        <div className="flex items-center justify-center gap-4">
                          <input
                            type="text"
                            value={userAnswer}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="输入答案..."
                            className="text-2xl font-bold text-center border-2 border-blue-300 rounded-lg px-4 py-2 w-48 focus:border-blue-500 focus:outline-none"
                            disabled={showExplanation}
                            autoFocus
                          />
                          <button
                            onClick={checkAnswer}
                            disabled={showExplanation || !userAnswer.trim()}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                          >
                            确认
                          </button>
                        </div>
                      </div>

                      {/* 反馈信息 */}
                      {feedback && (
                        <div className={`text-xl font-bold mb-4 ${feedback.includes('正确') ? 'text-green-600' : 'text-red-600'}`}>
                          {feedback}
                        </div>
                      )}

                      {/* 解释说明 */}
                      {showExplanation && currentQuestion.explanation && (
                        <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                          <div className="text-sm text-blue-800">
                            💡 {currentQuestion.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // 游戏结束界面
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      🎉 游戏结束！
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{score}</div>
                          <div className="text-sm text-gray-600">最终得分</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                          <div className="text-sm text-gray-600">答对题数</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{totalQuestions}</div>
                          <div className="text-sm text-gray-600">总题数</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                          </div>
                          <div className="text-sm text-gray-600">正确率</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={restartGame}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        重新选择年级
                      </button>
                      <button
                        onClick={startGame}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        再玩一次
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathGame;

