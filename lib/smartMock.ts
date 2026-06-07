import type { Script, Character, Scene, SceneElement } from './types';

/**
 * 智能生成剧本 mock 数据
 * 根据小说内容自动提取角色、时间、地点等信息
 */
export function generateSmartMockScript(novelText: string): Script {
  // 1. 提取标题
  const title = extractTitle(novelText);
  
  // 2. 提取角色
  const characters = extractCharacters(novelText);
  
  // 3. 提取场景
  const scenes = extractScenes(novelText, characters);
  
  return {
    meta: {
      title,
      author: '未知作者',
      adaptedBy: 'AI 助手（示例数据）',
      created: new Date().toISOString().split('T')[0],
    },
    characters,
    scenes,
  };
}

/**
 * 从小说文本中提取标题
 */
function extractTitle(text: string): string {
  // 尝试匹配章节标题
  const chapterPatterns = [
    /^(第[零一二三四五六七八九十百千万\d]+章\s*[：:：]?\s*)(.+)$/m,
    /^(Chapter\s+\d+[\s:：]+)(.+)$/im,
    /^(第[零一二三四五六七八九十百千万\d]+节\s*[：:：]?\s*)(.+)$/m,
  ];
  
  for (const pattern of chapterPatterns) {
    const match = text.match(pattern);
    if (match && match[2]) {
      return match[2].trim();
    }
  }
  
  // 如果没有找到章节标题，取前50个字符作为标题
  const firstLine = text.split('\n')[0]?.trim();
  if (firstLine && firstLine.length > 0) {
    return firstLine.substring(0, 50);
  }
  
  return '未命名剧本';
}

/**
 * 从小说文本中提取角色列表
 */
function extractCharacters(text: string): Character[] {
  const characterNames = new Set<string>();
  
  // 常见的人称代词模式
  const patterns = [
    // "xxx说"、"xxx道"等对话引述
    /[""]([^""]+)[""][说问道喊叫吼叹气笑哭]、/g,
    /([^\s]{2,4})[说问道喊叫吼叹气笑哭]/g,
    // 对话格式
    /[""]([^""]+)[""]/g,
    // 引号内的内容
    /[「『]([^」』]+)[」』]/g,
  ];
  
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const name = match[1]?.trim();
      if (name && name.length >= 2 && name.length <= 6 && !/^\d+$/.test(name)) {
        // 过滤掉太短或太长的名字，以及纯数字
        characterNames.add(name);
      }
    }
  }
  
  // 转换为数组，最多返回10个
  const characters = Array.from(characterNames).slice(0, 10);
  
  // 如果没有找到足够的角色，添加默认角色
  if (characters.length < 2) {
    characters.push('主角', '配角');
  }
  
  return characters.map(name => ({
    name,
    description: '待补充角色设定',
  }));
}

/**
 * 从小说文本中提取场景
 */
function extractScenes(text: string, characters: Character[]): Scene[] {
  const scenes: Scene[] = [];
  
  // 1. 尝试按段落分割，识别场景
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  // 2. 提取时间和地点关键词
  const timeKeywords = extractTimeKeywords(text);
  const locationKeywords = extractLocationKeywords(text);
  
  // 3. 将文本分成3-5个场景
  const sceneCount = Math.min(5, Math.max(3, Math.floor(paragraphs.length / 3)));
  const paragraphsPerScene = Math.floor(paragraphs.length / sceneCount);
  
  const mainCharacter = characters[0]?.name || '主角';
  const secondCharacter = characters[1]?.name || '配角';
  
  for (let i = 0; i < sceneCount; i++) {
    const startIdx = i * paragraphsPerScene;
    const endIdx = i === sceneCount - 1 ? paragraphs.length : (i + 1) * paragraphsPerScene;
    const sceneParagraphs = paragraphs.slice(startIdx, endIdx);
    
    // 合并段落内容
    const sceneContent = sceneParagraphs.join('\n\n');
    
    // 提取对话和动作
    const elements = extractElements(sceneContent, characters);
    
    // 如果没有提取到元素，生成示例元素
    if (elements.length === 0) {
      elements.push(
        { type: 'narration', content: `场景 ${i + 1} 开始` },
        { type: 'action', character: mainCharacter, content: '环顾四周' },
        { type: 'dialogue', character: mainCharacter, content: '这是场景的描述内容', tone: '平静' },
      );
    }
    
    // 智能选择时间和地点
    const time = timeKeywords[i % timeKeywords.length] || '白天';
    const location = locationKeywords[i % locationKeywords.length] || '某地';
    
    scenes.push({
      id: `scene-${i + 1}`,
      title: `场景 ${i + 1}`,
      time,
      location,
      description: `发生在${time}的${location}`,
      elements,
    });
  }
  
  return scenes;
}

/**
 * 提取时间关键词
 */
function extractTimeKeywords(text: string): string[] {
  const timePatterns = [
    { pattern: /清晨|早晨|早上|上午/g, keyword: '清晨' },
    { pattern: /中午|正午|午时/g, keyword: '中午' },
    { pattern: /下午|午后|傍晚|黄昏/g, keyword: '傍晚' },
    { pattern: /夜晚|夜间|深夜|午夜/g, keyword: '夜晚' },
    { pattern: /黎明|破晓|日出/g, keyword: '黎明' },
    { pattern: /春天|夏季|秋天|冬天|四季/g, keyword: '季节' },
  ];
  
  const foundTimes: string[] = [];
  
  for (const { pattern, keyword } of timePatterns) {
    if (pattern.test(text)) {
      foundTimes.push(keyword);
    }
  }
  
  // 默认时间
  if (foundTimes.length === 0) {
    foundTimes.push('白天', '夜晚', '清晨', '傍晚');
  }
  
  return [...new Set(foundTimes)];
}

/**
 * 提取地点关键词
 */
function extractLocationKeywords(text: string): string[] {
  const locationPatterns = [
    { pattern: /房间|卧室|书房|客厅/g, keyword: '室内 - 房间' },
    { pattern: /街道|路上|马路|大道/g, keyword: '室外 - 街道' },
    { pattern: /咖啡厅|咖啡店|餐厅|饭店/g, keyword: '室内 - 餐厅' },
    { pattern: /公司|办公室|写字楼/g, keyword: '室内 - 办公室' },
    { pattern: /学校|教室|操场|图书馆/g, keyword: '室内 - 学校' },
    { pattern: /公园|花园|广场/g, keyword: '室外 - 公园' },
    { pattern: /车站|机场|火车站/g, keyword: '室外 - 车站' },
    { pattern: /医院|诊所|药店/g, keyword: '室内 - 医院' },
    { pattern: /商店|超市|商场|市场/g, keyword: '室内 - 商店' },
    { pattern: /家里|家中|家里/g, keyword: '室内 - 家中' },
  ];
  
  const foundLocations: string[] = [];
  
  for (const { pattern, keyword } of locationPatterns) {
    if (pattern.test(text)) {
      foundLocations.push(keyword);
    }
  }
  
  // 默认地点
  if (foundLocations.length === 0) {
    foundLocations.push('室内 - 某处', '室外 - 某处', '室内 - 房间', '室外 - 街道');
  }
  
  return [...new Set(foundLocations)];
}

/**
 * 从文本中提取场景元素
 */
function extractElements(text: string, characters: Character[]): SceneElement[] {
  const elements: SceneElement[] = [];
  
  // 1. 提取对话
  const dialoguePatterns = [
    /[""]([^""]+)[""]/g,
    /[「『]([^」』]+)[」』]/g,
    /'([^']+)'/g,
  ];
  
  const mainCharacter = characters[0]?.name || '主角';
  
  for (const pattern of dialoguePatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const content = match[1]?.trim();
      if (content && content.length > 0 && content.length < 200) {
        elements.push({
          type: 'dialogue',
          character: mainCharacter,
          content,
          tone: guessTone(content),
        });
      }
    }
  }
  
  // 2. 提取动作描述
  const actionPatterns = [
    /([^\s]{2,4})(?:轻轻|慢慢|缓缓|突然|猛地|快速)?(站起|坐下|走|跑|停下|转身|抬头|低头|微笑|皱眉|叹气|点头|摇头|握手|拥抱|推门|开门|关门|坐下|站起|躺下|起身)/g,
  ];
  
  for (const pattern of actionPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const character = match[1]?.trim();
      const action = match[2]?.trim();
      if (character && action && character.length >= 2) {
        elements.push({
          type: 'action',
          character: characters.find(c => c.name.includes(character))?.name || mainCharacter,
          content: `${character}${action}`,
        });
      }
    }
  }
  
  // 3. 添加旁白（如果元素太多，只保留前5个）
  if (elements.length > 5) {
    elements.splice(5);
  }
  
  // 如果元素太少，添加一个旁白
  if (elements.length < 2) {
    const firstSentence = text.split(/[.。!！?？]/)[0]?.trim();
    if (firstSentence && firstSentence.length > 0 && firstSentence.length < 100) {
      elements.unshift({
        type: 'narration',
        content: firstSentence,
      });
    }
  }
  
  return elements;
}

/**
 * 根据对话内容猜测情感音调
 */
function guessTone(content: string): string {
  const tonePatterns = [
    { pattern: /[?？]$/, tone: '疑问' },
    { pattern: /[!！]$/, tone: '惊讶' },
    { pattern: /[.。]$/, tone: '平静' },
    { pattern: /吗|呢|吧|呀|么/g, tone: '询问' },
    { pattern: /!|\!|呀|啊|哇/g, tone: '兴奋' },
    { pattern: /...|…|～/g, tone: '犹豫' },
    { pattern: /别|不|没/g, tone: '否定' },
    { pattern: /谢谢|感谢|感激/g, tone: '感激' },
    { pattern: /对不起|抱歉|不好意思/g, tone: '歉意' },
  ];
  
  for (const { pattern, tone } of tonePatterns) {
    if (pattern.test(content)) {
      return tone;
    }
  }
  
  return '平静';
}
