import React, { useState, useEffect } from "react";

interface Category {
  maincategory_ko: string;
  maincategory_en: string;
  subcategories: {
    subcategory_ko: string;
    subcategory_en: string;
    detailcategories: {
      detailcategory_ko: string[];
      detailcategory_en: string[];
    };
  }[];
}
interface RenameData {
  category_field: string;
  prev_category: string;
  new_category: string;
}

interface SeniorFAQCategoryRenameFormProps {
  renameData: {
    category_field: string;
    prev_category: string;
    new_category: string;
  };
  setRenameData: React.Dispatch<React.SetStateAction<any>>;
  categories: Category[];
  selectedMainCategory: { ko: string; en: string };
  selectedSubCategory: { ko: string; en: string }; 
  handleCategorySelect: (field: string, value: string) => void;
  handleRename: () => void;
  isRenaming: boolean;
}

const SeniorFAQCategoryRenameForm: React.FC<SeniorFAQCategoryRenameFormProps> = ({
  renameData,
  setRenameData,
  categories,
  handleCategorySelect,
  handleRename,
  isRenaming,
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [availableSubcategories, setAvailableSubcategories] = useState<{ ko: string; en: string }[]>([]);
  const [availableDetailCategories, setAvailableDetailCategories] = useState<{ ko: string; en: string }[]>([]);


  
  useEffect(() => {
    if (!renameData.category_field.includes("subcategory") && !renameData.category_field.includes("detailcategory")) {
      setSelectedSubCategory("");
      setAvailableSubcategories([]);
      setAvailableDetailCategories([]);
      return;
    }

    if (!selectedMainCategory) return;

    const selectedCategory = categories.find((cat) =>
      renameData.category_field.includes("ko")
        ? cat.maincategory_ko === selectedMainCategory
        : cat.maincategory_en === selectedMainCategory
    );

    if (selectedCategory) {
      setAvailableSubcategories(
        selectedCategory.subcategories.map((sub) => ({
          ko: sub.subcategory_ko,
          en: sub.subcategory_en,
        }))
      );
    }
  }, [selectedMainCategory, renameData.category_field, categories]);

  useEffect(() => {
    if (!renameData.category_field.includes("detailcategory")) {
      setAvailableDetailCategories([]);
      return;
    }
    if (!selectedSubCategory) return;

    const selectedCategory = categories.find((cat) =>
      renameData.category_field.includes("ko")
        ? cat.maincategory_ko === selectedMainCategory
        : cat.maincategory_en === selectedMainCategory
    );

    const selectedSub = selectedCategory?.subcategories.find((sub) =>
      renameData.category_field.includes("ko")
        ? sub.subcategory_ko === selectedSubCategory
        : sub.subcategory_en === selectedSubCategory
    );

    if (selectedSub) {
      setAvailableDetailCategories(
        selectedSub.detailcategories.detailcategory_ko.map((ko, index) => ({
          ko,
          en: selectedSub.detailcategories.detailcategory_en[index] || "",
        }))
      );
    }
  }, [selectedMainCategory, selectedSubCategory, renameData.category_field, categories]);

  useEffect(() => {
  if (!renameData.prev_category) {
    if (renameData.category_field.includes("maincategory") && selectedMainCategory) {
      setRenameData((prev: RenameData) => ({ ...prev, prev_category: selectedMainCategory }));
    } else if (renameData.category_field.includes("subcategory") && selectedSubCategory) {
      setRenameData((prev: RenameData) => ({ ...prev, prev_category: selectedSubCategory }));
    }
  }
}, [renameData.category_field, selectedMainCategory, selectedSubCategory, setRenameData]);

  const isFormValid = () => {
    if (!renameData.category_field || !renameData.new_category) return false;

    if (renameData.category_field.includes("detailcategory")) {
      return !!selectedMainCategory && !!selectedSubCategory && !!renameData.prev_category;
    }

    if (renameData.category_field.includes("subcategory")) {
      return !!selectedMainCategory && !!renameData.prev_category;
    }

    if (renameData.category_field.includes("maincategory")) {
      return !!renameData.prev_category;
    }

    return false;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100"> 
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">선배 FAQ 카테고리 이름 변경</h1>
      <p className="text-center mb-4">해당되는 카테고리를 한번에 바꿀 수 있습니다.</p>

        {/* 카테고리 유형 선택 */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 유형 선택:</label>
          <select
            value={renameData.category_field}
            onChange={(e) => handleCategorySelect("category_field", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">카테고리 선택</option>
            <option value="maincategory_ko">주요 카테고리 (KO)</option>
            <option value="maincategory_en">주요 카테고리 (EN)</option>
            <option value="subcategory_ko">하위 카테고리 (KO)</option>
            <option value="subcategory_en">하위 카테고리 (EN)</option>
            <option value="detailcategory_ko">세부 카테고리 (KO)</option>
            <option value="detailcategory_en">세부 카테고리 (EN)</option>
          </select>
        </div>

        {/* 주요 카테고리 선택 */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">주요 카테고리:</label>
          <select
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">주요 카테고리 선택</option>
            {categories.map((cat) => (
              <option
                key={cat.maincategory_ko}
                value={renameData.category_field.includes("ko") ? cat.maincategory_ko : cat.maincategory_en}
              >
                {renameData.category_field.includes("ko") ? cat.maincategory_ko : cat.maincategory_en}
              </option>
            ))}
          </select>
        </div>

        {/* 하위 카테고리 선택 */}
        {(renameData.category_field.includes("subcategory") || renameData.category_field.includes("detailcategory")) && (
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">하위 카테고리:</label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">하위 카테고리 선택</option>
              {availableSubcategories.map((sub) => (
                <option key={sub.ko} value={renameData.category_field.includes("ko") ? sub.ko : sub.en}>
                  {renameData.category_field.includes("ko") ? sub.ko : sub.en}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 세부 카테고리 선택 */}
        {renameData.category_field.includes("detailcategory") && (
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">세부 카테고리:</label>
            <select
              value={renameData.prev_category}
              onChange={(e) => handleCategorySelect("prev_category", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">세부 카테고리 선택</option>
              {availableDetailCategories.map((detail) => (
                <option key={detail.ko} value={renameData.category_field.includes("ko") ? detail.ko : detail.en}>
                  {renameData.category_field.includes("ko") ? detail.ko : detail.en}
                </option>
              ))}
            </select>
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
        disabled={isRenaming || !isFormValid()}
        className={`w-full py-3 rounded-lg text-white font-bold transition ${
          isRenaming || !isFormValid()
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

export default SeniorFAQCategoryRenameForm;