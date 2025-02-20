import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { selectAuth } from "../../redux/authSlice";
import {
  clearFAQFilterState,
  clearSeniorFAQFilterState,
  clearLogFilterState,
  clearAdminLogFilterState,
  clearQuestionLogFilterState,
  clearLogAnalysisFilterState,
  clearFeedbackFilterState,
} from "../../redux/filterSlice";
import Logout from "./Logout";
import DeleteAccount from "./DeleteAccount";

const Header: React.FC = () => {
  const { username } = useSelector((state: RootState) => selectAuth(state));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // 필터 상태 리셋 후 네비게이션 함수
  const handleNavigation = (path: string) => {
    dispatch(clearFAQFilterState());
    dispatch(clearSeniorFAQFilterState());
    dispatch(clearLogFilterState());
    dispatch(clearAdminLogFilterState());
    dispatch(clearQuestionLogFilterState());
    dispatch(clearLogAnalysisFilterState());
    dispatch(clearFeedbackFilterState());
    navigate(path);
    if (location.pathname === path) {
      navigate(0);
    } else {
    
    }
  };

  return (
    <header className="bg-crimson p-4 flex justify-between items-center">
      <div className="text-2xl font-semibold">
        {isAuthPage ? (
          <span className="text-white">hoBIT</span>
        ) : (
          <button
            className="text-white hover:text-gray-600"
            onClick={() => handleNavigation("/home")}
          >
            hoBIT
          </button>
        )}
      </div>
      <nav className="flex items-center gap-4 relative">
        {!isAuthPage && (
          <>
            <button className="text-white hover:text-gray-600" onClick={() => handleNavigation("/faqs")}>
              FAQ
            </button>
            <button className="text-white hover:text-gray-600" onClick={() => handleNavigation("/seniorfaqs")}>
              SENIORFAQ
            </button>
            <button className="text-white hover:text-gray-600" onClick={() => handleNavigation("/logs")}>
              LOG
            </button>
            <button className="text-white hover:text-gray-600" onClick={() => handleNavigation("/userfeedbacks")}>
              FEEDBACK
            </button>
            <div className="relative">
              <button onClick={togglePopup} className="text-white hover:text-gray-600">
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
                  className="absolute right-0 top-10 bg-white border border-gray-300 rounded-lg shadow-md p-4 w-40"
                  style={{
                    zIndex: 1000,
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-black font-semibold">
                      {username ? (
                        <>
                          {username}님<br />
                          반갑습니다
                        </>
                      ) : (
                        "반갑습니다"
                      )}
                    </p>
                    <button onClick={closePopup} className="absolute top-3 right-2 text-gray-500 hover:text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
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
