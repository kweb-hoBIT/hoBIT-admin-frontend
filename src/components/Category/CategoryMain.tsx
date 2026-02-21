import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryMain: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    { path: "/categories/faq/rename", label: "FAQ 카테고리 수정", disabled: false },
    { path: "/categories/faq/reorder", label: "FAQ 카테고리 순서 수정", disabled: false },
    { path: "/categories/seniorfaq/rename", label: "선배 FAQ 카테고리 수정", disabled: false },
    { path: "/categories/seniorfaq/reorder", label: "선배 FAQ 카테고리 순서 수정", disabled: false },
    { path: "/categories/email/bulk-update", label: "이메일 변경", disabled: false },
    { path: "/categories/email/bulk-delete", label: "이메일 삭제", disabled: false },
    { path: "/categories/admin/bulk-update", label: "관리자 변경", disabled: false },
    { path: "/categories/admin/bulk-delete", label: "관리자 삭제", disabled: false },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">관리 페이지</h2>
        <div className="space-y-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => !option.disabled && navigate(option.path)}
              disabled={option.disabled}
              className={`block w-full text-white font-semibold text-lg py-3 px-4 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md ${
                option.disabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-crimson hover:bg-crimson-dark hover:scale-105"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMain;