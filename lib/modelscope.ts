import OpenAI from 'openai';
import yaml from 'js-yaml';
import type { Script } from './types';

const apiKey = process.env.MODELSCOPE_API_KEY || 'ms-25df072b-5228-4a46-9a64-c61a3e547744';

const client = new OpenAI({
  baseURL: 'https://api-inference.modelscope.cn/v1',
  apiKey: apiKey,
});

const SYSTEM_PROMPT = `
你是一位专业的剧本改编专家，擅长将小说文本转换为结构化的剧本格式。

请按照以下 YAML Schema 格式输出剧本：

\`\`\`yaml
meta:
  title: 剧本标题
  author: 原作者
  adaptedBy: 改编者
characters:
  - name: 角色名
    description: 角色描述
scenes:
  - id: scene-1
    title: 场景标题（可选）
    time: 时间（如"白天"、"夜晚"）
    location: 地点
    description: 场景描述（可选）
    elements:
      - type: dialogue
        character: 人物名
        content: 对话内容
        tone: 情感音调（如"愤怒"、"温柔"）（可选）
        action: 伴随动作（可选）
      - type: action
        character: 人物名（可选）
        content: 动作描述
      - type: narration
        content: 旁白内容
      - type: transition
        content: 场景转换描述
\`\`\`

要求：
1. 分析小说内容，提取主要情节
2. 将小说转换为 3-5 个场景的剧本
3. 确保每个人物都有名字，对话符合人物性格
4. 添加适当的动作和旁白描述
5. 输出必须是有效的 YAML 格式，不要包含其他文字

开始处理：
`;

export async function convertNovelToScript(novelText: string): Promise<{ script: Script; isMock: boolean; error?: string }> {
  try {
    console.log('Starting AI conversion...');
    console.log('API Key configured:', apiKey ? 'Yes' : 'No');
    console.log('Text length:', novelText.length);
    
    const response = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-V4-Flash',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: novelText.slice(0, 8000) },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const yamlContent = response.choices[0]?.message?.content?.trim() || '';
    console.log('AI response received, length:', yamlContent.length);
    
    if (!yamlContent) {
      console.warn('AI returned empty response, using mock data');
      return { script: generateMockScript(novelText), isMock: true, error: 'AI返回空响应' };
    }

    return { script: parseYamlToScript(yamlContent, novelText), isMock: false };
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error';
    console.error('ModelScope API error:', errorMessage);
    
    return { 
      script: generateMockScript(novelText), 
      isMock: true, 
      error: `API调用失败: ${errorMessage}` 
    };
  }
}

function parseYamlToScript(yamlContent: string, fallbackText: string): Script {
  try {
    const script = yaml.load(yamlContent) as Script;
    if (script && script.meta && script.scenes && script.scenes.length > 0) {
      console.log('YAML parsed successfully');
      return {
        ...script,
        meta: {
          ...script.meta,
          created: script.meta.created || new Date().toISOString().split('T')[0],
        },
      };
    }
    console.warn('YAML content is invalid or incomplete, using mock data');
  } catch (error: any) {
    console.error('YAML parse error:', error.message);
  }
  return generateMockScript(fallbackText);
}

function generateMockScript(novelText: string): Script {
  const titleMatch = novelText.match(/^(第[零一二三四五六七八九十]+章\s*[：:]?\s*)(.+)$/m);
  const title = titleMatch ? titleMatch[2].trim() : '剧本标题';
  
  return {
    meta: {
      title,
      author: '未知作者',
      adaptedBy: 'AI 助手',
      created: new Date().toISOString().split('T')[0],
    },
    characters: [
      { name: '主角', description: '故事的主要角色' },
      { name: '配角', description: '辅助角色' },
    ],
    scenes: [
      {
        id: 'scene-1',
        title: '开场',
        time: '白天',
        location: '室内 - 主角的房间',
        description: '阳光透过窗户洒进房间，主角正在阅读一本书',
        elements: [
          { type: 'narration', content: '故事开始于一个平静的午后，主角正在自己的房间里阅读。' },
          { type: 'action', character: '主角', content: '轻轻翻动书页，眉头微微皱起' },
          { type: 'dialogue', character: '主角', content: '这本书写得真不错...', tone: '自言自语', action: '喃喃自语' },
          { type: 'transition', content: '敲门声响起' },
        ],
      },
      {
        id: 'scene-2',
        title: '访客',
        time: '白天',
        location: '室内 - 主角的房间',
        elements: [
          { type: 'action', content: '敲门声越来越急促' },
          { type: 'action', character: '主角', content: '放下书，起身走向门口' },
          { type: 'dialogue', character: '主角', content: '来了！', tone: '疑惑' },
          { type: 'action', character: '主角', content: '打开房门' },
          { type: 'dialogue', character: '配角', content: '出事了！你快跟我来！', tone: '焦急', action: '神情慌张' },
          { type: 'dialogue', character: '主角', content: '发生什么事了？', tone: '惊讶' },
        ],
      },
      {
        id: 'scene-3',
        title: '冲突',
        time: '傍晚',
        location: '室外 - 街道',
        description: '夕阳西下，街道上人群熙熙攘攘',
        elements: [
          { type: 'narration', content: '两人快步走在街道上，配角向主角讲述着发生的事情。' },
          { type: 'dialogue', character: '配角', content: '就在刚才，有人看到那个神秘的身影又出现了', tone: '紧张' },
          { type: 'dialogue', character: '主角', content: '这么说，传闻是真的？', tone: '严肃' },
          { type: 'action', content: '一阵风吹过，带来一丝寒意' },
          { type: 'dialogue', character: '配角', content: '恐怕是的，我们必须尽快采取行动', tone: '坚定' },
        ],
      },
    ],
  };
}
