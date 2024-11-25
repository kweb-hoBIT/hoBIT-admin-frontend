import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { selectAuth } from '../redux/authSlice';
import Logout from './auth/Logout';
import DeleteAccount from './auth/DeleteAccount'; // DeleteAccount 컴포넌트 임포트

const Header: React.FC = () => {
  const { username } = useSelector((state: RootState) => selectAuth(state));
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false); // 회원탈퇴 팝업 상태 추가
  const location = useLocation();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleDeleteAccountPopup = () => {
    setShowDeleteAccount(!showDeleteAccount);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className="bg-pink-200 p-4 flex justify-between items-center">
      <div className="text-2xl font-semibold">
        <Link to="/main" className="text-gray-600 hover:text-gray-800">
          hoBIT
        </Link>
      </div>
      <nav className="flex items-center gap-4 relative">
        {!isAuthPage && (
          <>
            <Link to="/faqs" className="text-gray-600 hover:text-gray-800">
              FAQ
            </Link>
            <Link to="/logs" className="text-gray-600 hover:text-gray-800">
              LOG
            </Link>
            <div className="relative">
              <button onClick={togglePopup} className="text-gray-600 hover:text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5a7.5 7.5 0 0115 0"
                  />
                </svg>
              </button>
              {showPopup && (
                <div
                  className="absolute right-0 top-10 bg-pink-100 border border-gray-300 rounded-lg shadow-md p-4 w-40"
                  style={{
                    zIndex: 1000, // 팝업을 다른 요소보다 위로 표시
                  }}
                >
                  <p className="text-gray-700 font-semibold mb-2">
                    {username ? `${username}님 반갑습니다` : '반갑습니다'}
                  </p>
                  <div className="mb-2">
                    <Logout />
                  </div>
                  <div className="mb-2">
                    <DeleteAccount />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
