import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">메인 페이지</h2>
        <div className="space-y-4">
          {[
            { href: "/faqs", text: "FAQ로 이동" },
            { href: "/seniorfaqs", text: "선배 FAQ로 이동" },
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
