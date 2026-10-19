import React from "react";
import { useNavigate } from 'react-router-dom';
import { CheckSeniorFAQCategoryConflictResponse } from "../../types/seniorfaq";

type SeniorFAQCategoryConflictProps = {
  conflictedData: CheckSeniorFAQCategoryConflictResponse['data']['conflictedData'];
  onHandleCategoryConflictClose: () => void;
};

const SeniorFAQCategoryConflict: React.FC<SeniorFAQCategoryConflictProps> = ({ conflictedData, onHandleCategoryConflictClose }) => {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-[440px]">
        <h2 className="text-xl font-bold text-ink text-center">시니어 FAQ 카테고리 변경</h2>
        <p className="text-sm text-ink-2 text-center mt-1">변경 사항이 기존 카테고리와 충돌이 발생했습니다.</p>

        <div className="mt-5 space-y-4">
          {conflictedData.map((item, index) => (
            <div key={index} className="p-4 border border-line rounded-xl bg-card shadow-sm">
              <p className="text-sm font-semibold text-ink mb-2">
                {item.field === "maincategory" ? "주요 카테고리" : item.field === "subcategory" ? "하위 카테고리" : "세부 카테고리"}
              </p>

              <div className="p-3 bg-surface border border-danger/40 rounded-xl shadow-sm">
                <p className="text-xs font-medium text-danger">입력 카테고리</p>
                <p className="text-sm text-ink mt-1">한글: <span className="font-semibold">{item.input.ko}</span></p>
                <p className="text-sm text-ink mt-1">영어: <span className="font-semibold">{item.input.en}</span></p>
              </div>

              <div className="mt-2 space-y-2">
                {item.conflict.map((conflictItem, conflictIndex) => (
                  <div key={conflictIndex} className="p-3 bg-surface border border-success/40 rounded-xl shadow-sm">
                    <p className="text-xs font-medium text-success">⚠️ 충돌 카테고리</p>
                    <p className="text-sm text-ink mt-1">한글: <span className="font-semibold">{conflictItem.ko}</span></p>
                    <p className="text-sm text-ink mt-1">영어: <span className="font-semibold">{conflictItem.en}</span></p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm text-ink leading-relaxed">
          충돌 카테고리 중 하나와 맞게 설정해주세요.
          <br />
          기존 카테고리를 변경하려면 수정 페이지로 이동해주세요.
          </p>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            className="bg-accent text-white font-medium px-5 py-2 rounded-xl hover:bg-accent/90 transition shadow-md"
            onClick={() => navigate("/categories/seniorfaq/rename")}
          >
            카테고리 수정페이지로 이동
          </button>
          <button
            onClick={onHandleCategoryConflictClose}
            className="bg-card-2 text-ink font-medium px-5 py-2 rounded-xl hover:bg-card-3 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeniorFAQCategoryConflict;
