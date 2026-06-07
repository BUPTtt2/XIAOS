'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Scene } from '@/lib/types';

interface SortableSceneItemProps {
  scene: Scene;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onCopy: () => void;
}

function SortableSceneItem({
  scene,
  isSelected,
  onSelect,
  onDelete,
  onCopy,
}: SortableSceneItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-purple-50 border-2 border-purple-500'
          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
      }`}
      onClick={onSelect}
    >
      {/* 拖拽手柄 */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing"
        title="拖拽以排序"
      >
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>

      {/* 场景信息 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-800 truncate">
          {scene.title || '未命名场景'}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {scene.time} · {scene.location}
        </p>
        <p className="text-xs text-gray-400">
          {scene.elements?.length || 0} 个元素
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          title="复制场景"
        >
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
          title="删除场景"
        >
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface DraggableSceneListProps {
  scenes: Scene[];
  selectedSceneId: string | null;
  onSceneSelect: (id: string) => void;
  onSceneReorder: (oldIndex: number, newIndex: number) => void;
  onSceneDelete: (id: string) => void;
  onSceneCopy: (scene: Scene) => void;
}

export default function DraggableSceneList({
  scenes,
  selectedSceneId,
  onSceneSelect,
  onSceneReorder,
  onSceneDelete,
  onSceneCopy,
}: DraggableSceneListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = scenes.findIndex((s) => s.id === active.id);
      const newIndex = scenes.findIndex((s) => s.id === over.id);
      onSceneReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={scenes.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {scenes.map((scene) => (
            <SortableSceneItem
              key={scene.id}
              scene={scene}
              isSelected={selectedSceneId === scene.id}
              onSelect={() => onSceneSelect(scene.id)}
              onDelete={() => onSceneDelete(scene.id)}
              onCopy={() => onSceneCopy(scene)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
