import type { Script } from './types';

const STORAGE_KEYS = {
  DRAFT_SCRIPT: 'xiaos_draft_script',
  DRAFT_FILE: 'xiaos_draft_file',
  RECENT_CHARACTERS: 'xiaos_recent_characters',
} as const;

export interface DraftData {
  script: Script;
  fileContent: string;
  fileName: string;
  savedAt: string;
}

export interface CharacterPreset {
  name: string;
  description: string;
  addedAt: string;
}

// 保存草稿
export function saveDraft(data: DraftData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT_SCRIPT, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

// 获取草稿
export function getDraft(): DraftData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DRAFT_SCRIPT);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to get draft:', error);
    return null;
  }
}

// 删除草稿
export function deleteDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_SCRIPT);
  } catch (error) {
    console.error('Failed to delete draft:', error);
  }
}

// 保存文件草稿
export function saveFileDraft(content: string, fileName: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT_FILE, JSON.stringify({ content, fileName }));
  } catch (error) {
    console.error('Failed to save file draft:', error);
  }
}

// 获取文件草稿
export function getFileDraft(): { content: string; fileName: string } | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DRAFT_FILE);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to get file draft:', error);
    return null;
  }
}

// 添加最近使用的角色
export function addRecentCharacter(name: string, description: string = ''): void {
  try {
    const characters = getRecentCharacters();
    const existing = characters.findIndex(c => c.name === name);
    
    if (existing !== -1) {
      characters.splice(existing, 1);
    }
    
    characters.unshift({
      name,
      description,
      addedAt: new Date().toISOString(),
    });
    
    // 只保留最近20个
    const trimmed = characters.slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.RECENT_CHARACTERS, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to add recent character:', error);
  }
}

// 获取最近使用的角色
export function getRecentCharacters(): CharacterPreset[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_CHARACTERS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to get recent characters:', error);
    return [];
  }
}

// 清除所有草稿
export function clearAllDrafts(): void {
  deleteDraft();
  localStorage.removeItem(STORAGE_KEYS.DRAFT_FILE);
  localStorage.removeItem(STORAGE_KEYS.RECENT_CHARACTERS);
}
