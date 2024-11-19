import React from 'react';
import Button from '../Button';
import ProtectedPage from '../ProtectedPage';

const Main: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">메인 페이지</h2>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            children="FAQ로 이동"
            to="/faqs"
            className="w-full bg-pink-200 text-gray-600 font-semibold text-xl p-2 rounded-md transition-colors duration-300"
          />
          <Button
            type="button"
            children="로그로 이동"
            to="/logs"
            className="w-full bg-pink-200 text-gray-600 font-semibold text-xl p-2 rounded-md transition-colors duration-300"
          />
          <Button
            type="button"
            children="로그 분석 페이지로 이동"
            to="/logs/analytics"
            className="w-full bg-pink-200 text-gray-600 font-semibold text-xl p-2 rounded-md transition-colors duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
