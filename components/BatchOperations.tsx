'use client';

import { useState } from 'react';

interface BatchToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  onCancel: () => void;
}

export default function BatchToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onCancel,
}: BatchToolbarProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-700 font-medium">
            已选择 {selectedCount} / {totalCount} 个项目
          </span>
          <div className="flex gap-2">
            <button
              onClick={selectedCount === totalCount ? onDeselectAll : onSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {selectedCount === totalCount ? '取消全选' : '全选'}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            取消
          </button>
          <button
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            删除选中 ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
}
