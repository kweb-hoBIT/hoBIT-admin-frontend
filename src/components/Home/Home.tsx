import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white-50">
      <div className="absolute top-4 left-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md max-w-xs font-sans">
        {/* 2026년 2월 16일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2026년 1월 21일 (수요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>피드백 유해성 검사 수정 & 피드백 ui 편의성 개선</li>
          </ul>
        </div>

        {/* 2026년 2월 15일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2026년 1월 21일 (수요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>답변카드 질문 표시 & 선배모드 동작 로직 수정</li>
          </ul>
        </div>
        {/* 2026년 2월 16일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2026년 1월 21일 (수요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>답변카드 질문 표시 & 선배모드 동작 로직 수정</li>
          </ul>
        </div>

        {/* 2026년 1월 21일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2026년 1월 21일 (수요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>DeepL 에러 수정 & FAQ 미리보기 수정</li>
          </ul>
        </div>

        {/* 2026년 1월 18일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2026년 1월 18일 (일요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>모델 학습 실패 시 이메일 & 에러 페이지 추가</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">메인 페이지</h2>
        <div className="space-y-4">
          {[
            { href: "/faqs", text: "FAQ로 이동" },
            { href: "/seniorfaqs", text: "선배 FAQ로 이동" },
            { href: "/categories", text: "카테고리로 이동" },
            { href: "/logs", text: "로그로 이동" },
            { href: "/logs/analytics", text: "로그 분석으로 이동" },
            { href: "/userfeedbacks", text: "유저 피드백으로 이동" },
          ].map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="block w-full bg-crimson hover:bg-crimson-dark text-white font-semibold text-lg py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-opacity-50 shadow-md"
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
