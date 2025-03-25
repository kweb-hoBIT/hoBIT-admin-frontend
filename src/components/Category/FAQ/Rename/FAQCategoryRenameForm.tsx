import React, { useState, useEffect } from "react";

interface Category {
  maincategory_ko: string;
  maincategory_en: string;
  subcategories: {
    subcategory_ko: string[];
    subcategory_en: string[];
  };
}

interface FAQCategoryRenameFormProps {
  renameData: {
    category_field: string;
    prev_category: string;
    new_category: string;
  };
  setRenameData: React.Dispatch<React.SetStateAction<any>>;
  categories: Category[];
  handleCategorySelect: (field: string, value: string) => void;
  handleRename: () => void;
  isRenaming: boolean;
}

const FAQCategoryRenameForm: React.FC<FAQCategoryRenameFormProps> = ({
  renameData,
  setRenameData,
  categories,
  handleCategorySelect,
  handleRename,
  isRenaming,
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);

  useEffect(() => {
    if (!renameData.category_field.includes("subcategory") || !selectedMainCategory) return;

    const selectedCategory = categories.find((cat) =>
      renameData.category_field === "subcategory_ko"
        ? cat.maincategory_ko === selectedMainCategory
        : cat.maincategory_en === selectedMainCategory
    );

    setAvailableSubcategories(
      selectedCategory
        ? renameData.category_field === "subcategory_ko"
          ? selectedCategory.subcategories.subcategory_ko
          : selectedCategory.subcategories.subcategory_en
        : []
    );
  }, [selectedMainCategory, renameData.category_field, categories]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100"> {/* 화면 가운데에 고정 */}
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">FAQ 카테고리 이름 변경</h1>
      <p className="text-center mb-4">해당되는 카테고리를 한번에 바꿀 수 있습니다.</p>
    
      {/* 카테고리 유형 선택 */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 유형 선택:</label>
        <select
          value={renameData.category_field}
          onChange={(e) => handleCategorySelect("category_field", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">카테고리 선택</option>
          <option value="maincategory_ko">주요 카테고리 (KO)</option>
          <option value="maincategory_en">주요 카테고리 (EN)</option>
          <option value="subcategory_ko">하위 카테고리 (KO)</option>
          <option value="subcategory_en">하위 카테고리 (EN)</option>
        </select>
      </div>

      {/* 주요 카테고리 선택 (주요 카테고리 변경 시) */}
      {(renameData.category_field === "maincategory_ko" || renameData.category_field === "maincategory_en") && (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">기존 주요 카테고리:</label>
          <select
            value={renameData.prev_category}
            onChange={(e) => handleCategorySelect("prev_category", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">주요 카테고리 선택</option>
            {categories.map((cat) => (
              <option
                key={cat.maincategory_ko}
                value={renameData.category_field === "maincategory_ko" ? cat.maincategory_ko : cat.maincategory_en}
              >
                {renameData.category_field === "maincategory_ko" ? cat.maincategory_ko : cat.maincategory_en}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 하위 카테고리 변경 시, 먼저 주요 카테고리를 선택해야 함 */}
      {(renameData.category_field === "subcategory_ko" || renameData.category_field === "subcategory_en") && (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">먼저 주요 카테고리를 선택하세요:</label>
          <select
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">주요 카테고리 선택</option>
            {categories.map((cat) => (
              <option
                key={cat.maincategory_ko}
                value={renameData.category_field === "subcategory_ko" ? cat.maincategory_ko : cat.maincategory_en}
              >
                {renameData.category_field === "subcategory_ko" ? cat.maincategory_ko : cat.maincategory_en}
              </option>
            ))}
          </select>

          {/* 선택된 주요 카테고리에 따른 하위 카테고리 목록 표시 */}
          {selectedMainCategory && (
            <div className="mt-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">기존 하위 카테고리:</label>
              <select
                value={renameData.prev_category}
                onChange={(e) => handleCategorySelect("prev_category", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">하위 카테고리 선택</option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* 새로운 카테고리 입력 필드 */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">새로운 카테고리:</label>
        <input
          type="text"
          value={renameData.new_category}
          onChange={(e) => handleCategorySelect("new_category", e.target.value)}
          placeholder="새 카테고리 입력"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* 카테고리 변경 버튼 */}
      <button
        onClick={handleRename}
        disabled={isRenaming || !renameData.prev_category || !renameData.new_category}
        className={`w-full py-3 rounded-lg text-white font-bold transition ${
          isRenaming || !renameData.prev_category || !renameData.new_category
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-crimson hover:bg-crimson-dark"
        }`}
      >
        {isRenaming ? "변경 중..." : "카테고리 이름 변경"}
      </button>
      </div>
      </div>
  );
};

export default FAQCategoryRenameForm;