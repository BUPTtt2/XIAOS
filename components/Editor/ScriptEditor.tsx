import { useState } from 'react';
import type { Script, Scene, Character } from '@/lib/types';
import yaml from 'js-yaml';
import SceneEditor from './SceneEditor';
import DraggableSceneList from '../DraggableSceneList';

interface ScriptEditorProps {
  script: Script;
  onUpdate: (script: Script) => void;
}

export default function ScriptEditor({ script, onUpdate }: ScriptEditorProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'yaml'>('editor');
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(
    script.scenes[0]?.id || null
  );

  const updateMeta = (field: keyof Script['meta'], value: string) => {
    onUpdate({ ...script, meta: { ...script.meta, [field]: value } });
  };

  const updateCharacters = (characters: Character[]) => {
    onUpdate({ ...script, characters });
  };

  const addCharacter = () => {
    updateCharacters([...script.characters, { name: '', description: '' }]);
  };

  const updateCharacter = (index: number, updates: Partial<Character>) => {
    const newCharacters = [...script.characters];
    newCharacters[index] = { ...newCharacters[index], ...updates };
    updateCharacters(newCharacters);
  };

  const deleteCharacter = (index: number) => {
    updateCharacters(script.characters.filter((_, i) => i !== index));
  };

  const updateScene = (index: number, scene: Scene) => {
    const newScenes = [...script.scenes];
    newScenes[index] = scene;
    onUpdate({ ...script, scenes: newScenes });
  };

  const reorderScenes = (oldIndex: number, newIndex: number) => {
    const newScenes = [...script.scenes];
    const [removed] = newScenes.splice(oldIndex, 1);
    newScenes.splice(newIndex, 0, removed);
    onUpdate({ ...script, scenes: newScenes });
  };

  const deleteScene = (id: string) => {
    const newScenes = script.scenes.filter((s) => s.id !== id);
    onUpdate({ ...script, scenes: newScenes });
    if (selectedSceneId === id) {
      setSelectedSceneId(newScenes[0]?.id || null);
    }
  };

  const copyScene = (scene: Scene) => {
    const newScene: Scene = {
      ...scene,
      id: `scene-${Date.now()}`,
      title: `${scene.title || '场景'} (副本)`,
    };
    const currentIndex = script.scenes.findIndex((s) => s.id === scene.id);
    const newScenes = [...script.scenes];
    newScenes.splice(currentIndex + 1, 0, newScene);
    onUpdate({ ...script, scenes: newScenes });
    setSelectedSceneId(newScene.id);
  };

  const addScene = () => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      title: '',
      time: '',
      location: '',
      description: '',
      elements: [],
    };
    onUpdate({ ...script, scenes: [...script.scenes, newScene] });
    setSelectedSceneId(newScene.id);
  };

  const yamlContent = yaml.dump(script, { indent: 2 });

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'editor'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          可视化编辑
        </button>
        <button
          onClick={() => setActiveTab('yaml')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'yaml'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          YAML 源码
        </button>
      </div>

      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-h-[calc(100vh-200px)] overflow-hidden">
          {/* 左侧：场景列表 */}
          <div className="lg:col-span-1 overflow-y-auto max-h-[calc(100vh-300px)]">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">场景列表</h3>
              <button
                onClick={addScene}
                className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors mb-3"
              >
                + 添加场景
              </button>
              <DraggableSceneList
                scenes={script.scenes}
                selectedSceneId={selectedSceneId}
                onSceneSelect={setSelectedSceneId}
                onSceneReorder={reorderScenes}
                onSceneDelete={deleteScene}
                onSceneCopy={copyScene}
              />
            </div>
          </div>

          {/* 右侧：编辑区域 */}
          <div className="lg:col-span-2 overflow-y-auto max-h-[calc(100vh-300px)]">
            {/* 基本信息 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">基本信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">剧本标题</label>
                  <input
                    type="text"
                    value={script.meta.title || ''}
                    onChange={(e) => updateMeta('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">原作者</label>
                  <input
                    type="text"
                    value={script.meta.author || ''}
                    onChange={(e) => updateMeta('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">改编者</label>
                  <input
                    type="text"
                    value={script.meta.adaptedBy || ''}
                    onChange={(e) => updateMeta('adaptedBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">版本</label>
                  <input
                    type="text"
                    value={script.meta.version || ''}
                    onChange={(e) => updateMeta('version', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* 人物管理 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">出场人物</h3>
                <button
                  onClick={addCharacter}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                >
                  + 添加人物
                </button>
              </div>
              <div className="space-y-3">
                {script.characters.map((character, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="人物姓名"
                      value={character.name}
                      onChange={(e) => updateCharacter(index, { name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="人物描述"
                      value={character.description || ''}
                      onChange={(e) => updateCharacter(index, { description: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <button
                      onClick={() => deleteCharacter(index)}
                      className="px-3 py-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 场景编辑 */}
            <div>
              {selectedSceneId ? (
                (() => {
                  const selectedScene = script.scenes.find((s) => s.id === selectedSceneId);
                  if (!selectedScene) return null;
                  const sceneIndex = script.scenes.findIndex((s) => s.id === selectedSceneId);
                  return (
                    <SceneEditor
                      scene={selectedScene}
                      onUpdate={(updatedScene) => updateScene(sceneIndex, updatedScene)}
                      onDelete={() => deleteScene(selectedSceneId)}
                      onCopy={() => copyScene(selectedScene)}
                      onAddElement={() => {}}
                    />
                  );
                })()
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p>从左侧选择一个场景进行编辑</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'yaml' && (
        <div className="p-6">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-[calc(100vh-200px)] overflow-y-auto">
            {yamlContent}
          </pre>
        </div>
      )}
    </div>
  );
}
