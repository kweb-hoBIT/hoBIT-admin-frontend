import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface FAQCategoryReorderFormProps {
  categoryOrder: string[];
  onMove: (fromIndex: number, toIndex: number) => void;
  onSubmit: () => void;
  onReset: () => void;
  isUpdating?: boolean;
}

const FAQCategoryReorderForm: React.FC<FAQCategoryReorderFormProps> = ({ categoryOrder, onMove, onReset, onSubmit, isUpdating }) => {
  const ItemType = 'CATEGORY';

  const DraggableItem = ({ category, index }: { category: string; index: number }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemType,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    const [, drop] = useDrop({
      accept: ItemType,
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          onMove(item.index, index);
          item.index = index;
        }
      },
    });
  
    return (
    <li
      ref={(node) => drag(drop(node))}
      className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-sm bg-white"
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.2s ease',
        cursor: 'move',
      }}
    >
      <span className="text-gray-700 font-medium">
        {index + 1}. {category}
      </span>
    </li>
        );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">FAQ 카테고리 순서 변경</h2>
        <p className="text-center mb-4">카테고리 순서를 자유롭게 조정할 수 있습니다.</p>
        <div className="flex justify-end mb-4">
          <button
            onClick={onReset}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            초기화
          </button>
        </div>
        <ul className="space-y-3 mb-6">
          {categoryOrder.map((category, index) => (
            <DraggableItem key={category} category={category} index={index} />
          ))}
        </ul>
        <button
          onClick={onSubmit}
          className="w-full py-3 bg-crimson text-white font-bold rounded-lg hover:bg-crimson-dark transition"
        >
          {isUpdating ? '변경 중...' : '순서 변경'}
        </button>
      </div>
    </div>
  );
};

export default FAQCategoryReorderForm;
