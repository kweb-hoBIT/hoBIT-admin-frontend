import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface CategoryData {
  maincategory_ko: string;
  order: number;
  subcategories?: SubcategoryData[];
}

interface SubcategoryData {
  subcategory_ko: string;
  order: number;
}

interface FAQCategoryReorderFormProps {
  categories: CategoryData[];
  onMove: (type: 'main' | 'sub', fromIndex: number, toIndex: number, mainIdx?: number) => void;
  onSubmit: () => void;
  onReset?: () => void;
  isUpdating?: boolean;
}

const FAQCategoryReorderForm: React.FC<FAQCategoryReorderFormProps> = ({
  categories,
  onMove,
  onSubmit,
  onReset,
  isUpdating,
}) => {
  const [expandedMain, setExpandedMain] = useState<{ [key: number]: boolean }>({});

  const toggleMainCategory = (index: number) => {
    setExpandedMain(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const DraggableMainItem = ({ category, index }: { category: CategoryData; index: number }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'MAIN_CATEGORY',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'MAIN_CATEGORY',
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          onMove('main', item.index, index);
          item.index = index;
        }
      },
    });

    return (
      <li className="border border-gray-300 rounded-lg shadow-sm bg-white mb-3">
        <div
          ref={(node) => drag(drop(node))}
          className="flex items-center justify-between p-3"
          style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
          }}
        >
          <span className="text-gray-800 font-bold flex-1">
            {index + 1}. {category.maincategory_ko}
          </span>
          {category.subcategories && category.subcategories.length > 0 && (
            <button
              onClick={() => toggleMainCategory(index)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              {expandedMain[index] ? '▼' : '▶'}
            </button>
          )}
        </div>
        {expandedMain[index] && category.subcategories && category.subcategories.length > 0 && (
          <ul className="pl-6 pr-3 pb-3 space-y-2">
            {category.subcategories.map((sub, subIdx) => (
              <DraggableSubItem
                key={`${index}-${subIdx}`}
                subcategory={sub}
                subIndex={subIdx}
                mainIndex={index}
              />
            ))}
          </ul>
        )}
      </li>
    );
  };

  const DraggableSubItem = ({
    subcategory,
    subIndex,
    mainIndex,
  }: {
    subcategory: SubcategoryData;
    subIndex: number;
    mainIndex: number;
  }) => {
    const [{ isDragging }, drag] = useDrag({
      type: `SUB_CATEGORY_${mainIndex}`,
      item: { subIndex, mainIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: `SUB_CATEGORY_${mainIndex}`,
      hover: (item: { subIndex: number; mainIndex: number }) => {
        if (item.subIndex !== subIndex) {
          onMove('sub', item.subIndex, subIndex, mainIndex);
          item.subIndex = subIndex;
        }
      },
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        className="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
      >
        <span className="text-gray-700 font-medium">
          {subIndex + 1}. {subcategory.subcategory_ko}
        </span>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">FAQ 카테고리 순서 변경</h2>
        <p className="text-center mb-4">주요 카테고리와 하위 카테고리 순서를 자유롭게 조정할 수 있습니다.</p>
        {onReset && (
          <div className="flex justify-end mb-4">
            <button
              onClick={onReset}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              초기화
            </button>
          </div>
        )}
        <ul className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
          {categories.map((category, index) => (
            <DraggableMainItem key={`main-${index}`} category={category} index={index} />
          ))}
        </ul>
        <button
          onClick={onSubmit}
          disabled={isUpdating}
          className="w-full py-3 bg-crimson text-white font-bold rounded-lg hover:bg-crimson-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? '변경 중...' : '순서 변경'}
        </button>
      </div>
    </div>
  );
};

export default FAQCategoryReorderForm;
