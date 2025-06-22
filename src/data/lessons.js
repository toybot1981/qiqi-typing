// 练习内容数据
import { chineseLessons } from './chineseLessons.js';

export const lessons = {
  // 字母练习
  letters: {
    id: 'letters',
    title: '字母练习',
    description: '学习键盘上的字母位置',
    icon: '🔤',
    type: 'english',
    levels: [
      {
        id: 'letters-basic',
        title: '基础字母',
        content: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      },
      {
        id: 'letters-uppercase',
        title: '大写字母',
        content: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      },
      {
        id: 'letters-mixed',
        title: '大小写混合',
        content: ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J']
      }
    ]
  },

  // 词汇练习
  words: {
    id: 'words',
    title: '词汇练习',
    description: '练习常用英文单词',
    icon: '📝',
    type: 'english',
    levels: [
      {
        id: 'words-animals',
        title: '动物单词',
        content: ['cat', 'dog', 'bird', 'fish', 'bear', 'lion', 'tiger', 'elephant', 'monkey', 'rabbit', 'horse', 'cow', 'pig', 'duck', 'chicken']
      },
      {
        id: 'words-colors',
        title: '颜色单词',
        content: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown', 'gray', 'gold', 'silver']
      },
      {
        id: 'words-numbers',
        title: '数字单词',
        content: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
      },
      {
        id: 'words-family',
        title: '家庭成员',
        content: ['mom', 'dad', 'sister', 'brother', 'grandma', 'grandpa', 'uncle', 'aunt', 'cousin', 'baby']
      }
    ]
  },

  // 句子练习
  sentences: {
    id: 'sentences',
    title: '句子练习',
    description: '练习完整的句子输入',
    icon: '💬',
    type: 'english',
    levels: [
      {
        id: 'sentences-greetings',
        title: '问候语',
        content: [
          'Hello, how are you?',
          'Good morning!',
          'Good afternoon!',
          'Good evening!',
          'Nice to meet you.',
          'Have a good day!',
          'See you later.',
          'Thank you very much.',
          'You are welcome.',
          'Please help me.'
        ]
      },
      {
        id: 'sentences-simple',
        title: '简单句子',
        content: [
          'I like cats.',
          'The sun is bright.',
          'Birds can fly.',
          'Fish live in water.',
          'I love my family.',
          'Today is a good day.',
          'The sky is blue.',
          'Flowers are beautiful.',
          'I can read books.',
          'Music makes me happy.'
        ]
      },
      {
        id: 'sentences-school',
        title: '学校相关',
        content: [
          'I go to school every day.',
          'My teacher is very kind.',
          'I have many friends at school.',
          'We learn new things together.',
          'Reading books is fun.',
          'Math helps me think.',
          'Art class is creative.',
          'I like to play games.',
          'Homework helps me practice.',
          'School is a great place to learn.'
        ]
      }
    ]
  },

  // 数字练习
  numbers: {
    id: 'numbers',
    title: '数字练习',
    description: '练习数字键的输入',
    icon: '🔢',
    type: 'english',
    levels: [
      {
        id: 'numbers-basic',
        title: '基础数字',
        content: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
      },
      {
        id: 'numbers-sequences',
        title: '数字序列',
        content: ['123', '456', '789', '012', '147', '258', '369', '159', '357', '246']
      },
      {
        id: 'numbers-mixed',
        title: '数字组合',
        content: ['2024', '1234', '5678', '9012', '1357', '2468', '1029', '3847', '5619', '7382']
      }
    ]
  },

  // 汉字练习
  characters: {
    id: 'characters',
    title: '汉字练习',
    description: '学习常用汉字的书写',
    icon: '🈯',
    type: 'chinese',
    levels: chineseLessons.characters.levels
  },

  // 中文词语练习
  chineseWords: {
    id: 'chineseWords',
    title: '词语练习',
    description: '练习常用词语和成语',
    icon: '📝',
    type: 'chinese',
    levels: chineseLessons.words.levels
  },

  // 中文句子练习
  chineseSentences: {
    id: 'chineseSentences',
    title: '句子练习',
    description: '练习完整句子的输入',
    icon: '💬',
    type: 'chinese',
    levels: chineseLessons.sentences.levels
  },

  // 古诗练习
  poems: {
    id: 'poems',
    title: '古诗练习',
    description: '经典古诗词练习',
    icon: '📜',
    type: 'chinese',
    levels: chineseLessons.poems.levels
  },

  // 成语练习
  idioms: {
    id: 'idioms',
    title: '成语练习',
    description: '常用成语学习',
    icon: '🎭',
    type: 'chinese',
    levels: chineseLessons.idioms.levels
  }
};

// 获取指定练习类型的所有关卡
export const getLessonLevels = (lessonType) => {
  return lessons[lessonType]?.levels || [];
};

// 获取指定关卡的内容
export const getLevelContent = (lessonType, levelId) => {
  const lesson = lessons[lessonType];
  if (!lesson) return [];
  
  const level = lesson.levels.find(l => l.id === levelId);
  return level?.content || [];
};

// 随机获取练习内容
export const getRandomContent = (lessonType, levelId, count = 10) => {
  const content = getLevelContent(lessonType, levelId);
  if (content.length === 0) return [];
  
  const shuffled = [...content].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, content.length));
};

// 按语言类型分组课程
export const getLessonsByLanguage = () => {
  const english = {};
  const chinese = {};
  
  Object.entries(lessons).forEach(([key, lesson]) => {
    if (lesson.type === 'chinese') {
      chinese[key] = lesson;
    } else {
      english[key] = lesson;
    }
  });
  
  return { english, chinese };
};

