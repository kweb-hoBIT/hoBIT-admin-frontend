import React from 'react';

interface FAQCategoryReorderFormProps {
  categoryOrder: string[];
  onMove: (fromIndex: number, toIndex: number) => void;
  onSubmit: () => void;
}

const FAQCategoryReorderForm: React.FC<FAQCategoryReorderFormProps> = ({ categoryOrder, onMove, onSubmit }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">FAQ 카테고리 순서 변경</h2>
        <p className="text-center mb-4">카테고리 순서를 자유롭게 조정할 수 있습니다.</p>
        <ul className="space-y-3 mb-6">
          {categoryOrder.map((category, index) => (
            <li key={category} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-sm">
              <span className="text-gray-700 font-medium">{category}</span>
              <div className="space-x-2">
                <button
                  onClick={() => onMove(index, index - 1)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ↑
                </button>
                <button
                  onClick={() => onMove(index, index + 1)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={onSubmit}
          className="w-full py-3 bg-crimson text-white font-bold rounded-lg hover:bg-crimson-dark transition"
        >
          순서 저장
        </button>
      </div>
    </div>
  );
};

export default FAQCategoryReorderForm;