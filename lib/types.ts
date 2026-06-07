export interface ScriptMeta {
  title: string;
  author?: string;
  adaptedBy?: string;
  version?: string;
  created?: string;
}

export interface Character {
  name: string;
  description?: string;
}

export type ScriptElementType = 'dialogue' | 'action' | 'narration' | 'transition';

export interface BaseScriptElement {
  type: ScriptElementType;
}

export interface DialogueElement extends BaseScriptElement {
  type: 'dialogue';
  character: string;
  content: string;
  tone?: string;
  action?: string;
}

export interface ActionElement extends BaseScriptElement {
  type: 'action';
  character?: string;
  content: string;
}

export interface NarrationElement extends BaseScriptElement {
  type: 'narration';
  content: string;
}

export interface TransitionElement extends BaseScriptElement {
  type: 'transition';
  content: string;
}

export type ScriptElement =
  | DialogueElement
  | ActionElement
  | NarrationElement
  | TransitionElement;

export interface Scene {
  id: string;
  title?: string;
  time?: string;
  location: string;
  description?: string;
  elements: ScriptElement[];
}

export interface Script {
  meta: ScriptMeta;
  characters: Character[];
  scenes: Scene[];
}
