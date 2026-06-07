import { useState } from 'react';
import type { Scene, ScriptElement, ScriptElementType } from '@/lib/types';
import BatchToolbar from '@/components/BatchOperations';

interface SceneEditorProps {
  scene: Scene;
  onUpdate: (scene: Scene) => void;
  onDelete: () => void;
  onCopy: () => void;
  onAddElement: () => void;
}

export default function SceneEditor({ 
  scene, 
  onUpdate, 
  onDelete, 
  onCopy,
  onAddElement 
}: SceneEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedElements, setSelectedElements] = useState<Set<number>>(new Set());

  const updateSceneField = (field: keyof Scene, value: string) => {
    onUpdate({ ...scene, [field]: value });
  };

  const updateElement = (index: number, updates: Partial<ScriptElement>) => {
    const newElements = [...scene.elements];
    newElements[index] = { ...newElements[index], ...updates };
    onUpdate({ ...scene, elements: newElements });
  };

  const deleteElement = (index: number) => {
    const newElements = scene.elements.filter((_, i) => i !== index);
    onUpdate({ ...scene, elements: newElements });
  };

  const copyElement = (index: number) => {
    const elementToCopy = scene.elements[index];
    const newElement = { ...elementToCopy };
    const newElements = [...scene.elements];
    newElements.splice(index + 1, 0, newElement);
    onUpdate({ ...scene, elements: newElements });
    setEditingId(`element-${index + 1}`);
  };

  const addNewElement = () => {
    const newElement: ScriptElement = {
      type: 'dialogue',
      character: '',
      content: '',
    };
    onUpdate({ ...scene, elements: [...scene.elements, newElement] });
    setEditingId(`element-${scene.elements.length}`);
  };

  // 批量选择
  const toggleElementSelection = (index: number) => {
    const newSelected = new Set(selectedElements);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedElements(newSelected);
  };

  const selectAllElements = () => {
    setSelectedElements(new Set(scene.elements.map((_, i) => i)));
  };

  const deselectAllElements = () => {
    setSelectedElements(new Set());
  };

  const deleteSelectedElements = () => {
    const newElements = scene.elements.filter((_, i) => !selectedElements.has(i));
    onUpdate({ ...scene, elements: newElements });
    setSelectedElements(new Set());
    setBatchMode(false);
  };

  const renderElementEditor = (element: ScriptElement, index: number) => {
    const isEditing = editingId === `element-${index}`;
    const isSelected = selectedElements.has(index);
    
    if (isEditing) {
      return (
        <div key={index} className="bg-blue-50 rounded-lg p-4 mb-2">
          <select
            value={element.type}
            onChange={(e) => updateElement(index, { type: e.target.value as ScriptElementType })}
            className="w-full mb-2 px-3 py-2 border rounded-lg"
          >
            <option value="dialogue">对话</option>
            <option value="action">动作</option>
            <option value="narration">旁白</option>
            <option value="transition">场景转换</option>
          </select>
          
          {element.type === 'dialogue' && (
            <>
              <input
                type="text"
                placeholder="人物名"
                value={(element as { character?: string }).character || ''}
                onChange={(e) => updateElement(index, { character: e.target.value })}
                className="w-full mb-2 px-3 py-2 border rounded-lg"
              />
              <textarea
                placeholder="对话内容"
                value={(element as { content: string }).content}
                onChange={(e) => updateElement(index, { content: e.target.value })}
                className="w-full mb-2 px-3 py-2 border rounded-lg"
                rows={3}
              />
              <input
                type="text"
                placeholder="情感音调（可选）"
                value={(element as { tone?: string }).tone || ''}
                onChange={(e) => updateElement(index, { tone: e.target.value })}
                className="w-full mb-2 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="伴随动作（可选）"
                value={(element as { action?: string }).action || ''}
                onChange={(e) => updateElement(index, { action: e.target.value })}
                className="w-full mb-2 px-3 py-2 border rounded-lg"
              />
            </>
          )}
          
          {element.type === 'action' && (
            <>
              <input
                type="text"
                placeholder="人物名（可选）"
                value={(element as { character?: string }).character || ''}
                onChange={(e) => updateElement(index, { character: e.target.value })}
                className="w-full mb-2 px-3 py-2 border rounded-lg"
              />
              <textarea
                placeholder="动作描述"
                value={(element as { content: string }).content}
                onChange={(e) => updateElement(index, { content: e.target.value })}
                className="w-full mb-2 px-3 py-2 border rounded-lg"
                rows={3}
              />
            </>
          )}
          
          {element.type === 'narration' && (
            <textarea
              placeholder="旁白内容"
              value={(element as { content: string }).content}
              onChange={(e) => updateElement(index, { content: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded-lg"
              rows={3}
            />
          )}
          
          {element.type === 'transition' && (
            <input
              type="text"
              placeholder="场景转换描述"
              value={(element as { content: string }).content}
              onChange={(e) => updateElement(index, { content: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded-lg"
            />
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => setEditingId(null)}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
            >
              保存
            </button>
            <button
              onClick={() => deleteElement(index)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
            >
              删除
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        onClick={() => {
          if (batchMode) {
            toggleElementSelection(index);
          } else {
            setEditingId(`element-${index}`);
          }
        }}
        className={`border rounded-lg p-3 mb-2 hover:bg-gray-50 cursor-pointer transition-colors ${
          batchMode
            ? isSelected
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
            : 'border-gray-200'
        }`}
      >
        {batchMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleElementSelection(index)}
            className="mr-2"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        
        {element.type === 'dialogue' && (
          <div>
            <span className="font-medium text-purple-600">{(element as { character?: string }).character || '未知人物'}</span>
            {(element as { tone?: string }).tone && (
              <span className="text-gray-400 text-xs ml-2">({(element as { tone: string }).tone})</span>
            )}
            <p className="text-gray-800 text-sm mt-1">{(element as { content: string }).content}</p>
            {(element as { action?: string }).action && (
              <p className="text-sm text-gray-500 italic">{(element as { action: string }).action}</p>
            )}
          </div>
        )}
        
        {element.type === 'action' && (
          <p className="text-sm text-gray-700">
            {(element as { character?: string }).character && (
              <span className="font-medium">{(element as { character: string }).character} </span>
            )}
            <span className="italic">{(element as { content: string }).content}</span>
          </p>
        )}
        
        {element.type === 'narration' && (
          <p className="text-sm text-gray-500 italic">{(element as { content: string }).content}</p>
        )}
        
        {element.type === 'transition' && (
          <p className="text-sm text-blue-500 font-medium text-center py-1">
            → {(element as { content: string }).content}
          </p>
        )}
        
        {!batchMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyElement(index);
            }}
            className="mt-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            复制
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="场景标题"
            value={scene.title || ''}
            onChange={(e) => updateSceneField('title', e.target.value)}
            className="text-lg font-semibold border-none bg-transparent focus:outline-none focus:ring-0 w-full mb-2"
          />
          <div className="flex gap-4 text-sm text-gray-500">
            <input
              type="text"
              placeholder="时间"
              value={scene.time || ''}
              onChange={(e) => updateSceneField('time', e.target.value)}
              className="px-2 py-1 border border-gray-200 rounded"
            />
            <input
              type="text"
              placeholder="地点"
              value={scene.location}
              onChange={(e) => updateSceneField('location', e.target.value)}
              className="px-2 py-1 border border-gray-200 rounded"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setBatchMode(!batchMode)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              batchMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {batchMode ? '退出批量' : '批量操作'}
          </button>
          <button
            onClick={onCopy}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            复制场景
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <textarea
        placeholder="场景描述（可选）"
        value={scene.description || ''}
        onChange={(e) => updateSceneField('description', e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4 text-sm resize-none"
        rows={2}
      />
      
      {batchMode && selectedElements.size > 0 && (
        <BatchToolbar
          selectedCount={selectedElements.size}
          totalCount={scene.elements.length}
          onSelectAll={selectAllElements}
          onDeselectAll={deselectAllElements}
          onDeleteSelected={deleteSelectedElements}
          onCancel={() => {
            setBatchMode(false);
            setSelectedElements(new Set());
          }}
        />
      )}
      
      <div className="space-y-2">
        {scene.elements.map((element, index) => renderElementEditor(element, index))}
      </div>
      
      <button
        onClick={addNewElement}
        className="mt-3 w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
      >
        + 添加元素
      </button>
    </div>
  );
}
