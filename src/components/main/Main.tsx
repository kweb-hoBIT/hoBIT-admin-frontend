import React from 'react';

const Main: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-2 rounded-3xl max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">메인 페이지</h2>
        <div className="flex flex-col gap-4">
          <a
            href="/faqs"
            className="w-full bg-crimson text-white font-semibold text-xl p-2 rounded-md transition-colors duration-300 text-center hover:bg-crimson-dark"
          >
            FAQ로 이동
          </a>
          <a
            href="/seniorfaqs"
            className="w-full bg-crimson text-white font-semibold text-xl p-2 rounded-md transition-colors duration-300 text-center hover:bg-crimson-dark"
          >
            선배 FAQ로 이동
          </a>
          <a
            href="/logs"
            className="w-full bg-crimson text-white font-semibold text-xl p-2 rounded-md transition-colors duration-300 text-center hover:bg-crimson-dark"
          >
            로그로 이동
          </a>
          <a
            href="/logs/analytics"
            className="w-full bg-crimson text-white font-semibold text-xl p-2 rounded-md transition-colors duration-300 text-center hover:bg-crimson-dark"
          >
            로그 분석 페이지로 이동
          </a>
        </div>
      </div>
    </div>
  );
};

export default Main;
