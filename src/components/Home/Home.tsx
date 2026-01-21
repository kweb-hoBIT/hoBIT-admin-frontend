import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white-50">
      <div className="absolute top-4 left-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md max-w-xs font-sans">
        {/* 2026년 8월 19일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2026년 1월 18일 (일요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>모델 학습 실패 시 이메일 알림 기능 추가 & 에러 페이지 추가</li>
          </ul>
        </div>
        
        {/* 8월 19일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2025년 8월 19일 (화요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>이메일, 전화번호, 관리자 자동완성 기능 추가</li>
          </ul>
        </div>
        
        {/* 8월 6일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2025년 8월 6일 (수요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>피드백 필터링 기능 추가(욕설, 비방글 등)</li>
          </ul>
        </div>
        
        {/* 4월 11일 */}
        <div className="mb-4">
          <p className="text-sm font-semibold">📌 2025년 4월 11일 (금요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>카테고리 순서 변경 기능 추가</li>
          </ul>
        </div>

        {/* 3월 31일 */}
        <div>
          <p className="text-sm font-semibold">📌 2025년 3월 31일 (금요일)</p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>하루마다 유저가 한 질문 중 FAQ와 매치되지 않는 질문을 찾아내 피드백에 추가 요청 기능 추가</li>
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
