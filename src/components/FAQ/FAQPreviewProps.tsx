import React, { useRef, useEffect } from 'react';
import { FaLink, FaPhoneVolume } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';

interface FAQPreviewProps {
  question_ko: string;
  question_en: string;
  answer_ko: { answer: string; url?: string; email?: string; phone?: string }[];
  answer_en: { answer: string; url?: string; email?: string; phone?: string }[];
  manager: string;
  maincategory_ko: string;
  maincategory_en: string;
  subcategory_ko: string;
  subcategory_en: string;
}

const FAQPreview: React.FC<FAQPreviewProps> = ({
  answer_ko,
  answer_en,
  maincategory_ko,
  maincategory_en,
  subcategory_ko,
  subcategory_en,
}) => {
  const koreanContainerRef = useRef<HTMLDivElement>(null);
  const englishContainerRef = useRef<HTMLDivElement>(null);

  // 🔁 좌우 스크롤 동기화
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target === koreanContainerRef.current && englishContainerRef.current) {
        englishContainerRef.current.scrollLeft = target.scrollLeft;
      }
      if (target === englishContainerRef.current && koreanContainerRef.current) {
        koreanContainerRef.current.scrollLeft = target.scrollLeft;
      }
    };

    koreanContainerRef.current?.addEventListener('scroll', handleScroll);
    englishContainerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      koreanContainerRef.current?.removeEventListener('scroll', handleScroll);
      englishContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderCards = (
    answers: typeof answer_ko,
    maincategory: string,
    subcategory: string,
    isKorean: boolean
  ) => (
    <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
      {answers.length > 0 ? (
        answers.map((item, index) => (
          <div
            key={index}
            className="
              h-fit
              bg-gray-100
              font-5medium
              text-base md:text-lg
              mt-[10px]
              rounded-[20px]
              px-[20px] py-[15px]
              w-full max-w-[330px] md:w-[350px]
              break-words inline-block
            "
          >
            {/* 카테고리 헤더 (첫 카드만) */}
            {index === 0 && (
              <div className="flex flex-row text-sm md:text-base text-[#686D76] items-center mb-[10px]">
                <h3>{maincategory}</h3>
                <IoIosArrowForward className="mx-1" />
                <h3 className="font-4regular">{subcategory}</h3>
              </div>
            )}

            {/* 본문 */}
            {item.answer
              .split('\n')
              .map((line, i) =>
                line === '' ? <br key={i} /> : <p key={i}>{line}</p>
              )}

            {/* Divider */}
            {(item.url || item.email || item.phone) && (
              <div className="w-full h-[1px] bg-gray-300 mt-[20px]" />
            )}

            {/* URL */}
            {item.url && (
              <div className="flex flex-row items-center mt-[20px]">
                <div className="flex items-center justify-center mr-[10px] 
                                bg-white p-[8px] rounded-full 
                                min-w-[36px] min-h-[36px]">
                  <FaLink className="text-xl text-[#686D76]" />
                </div>
                <a
                  href={item.url.startsWith('http') ? item.url : `http://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[18px] text-[#0A5EB0] cursor-pointer hover:underline break-all"
                >
                  사이트 바로가기
                </a>
              </div>
            )}

            {/* Email */}
            {item.email && (
              <div className="flex flex-row items-center mt-[10px]">
                <div className="flex items-center justify-center mr-[10px] 
                                bg-white p-[8px] rounded-full 
                                min-w-[36px] min-h-[36px]">
                  <MdOutlineEmail className="text-xl text-[#686D76]" />
                </div>
                <p className="text-[18px] break-all">{item.email}</p>
              </div>
            )}

            {/* Phone */}
            {item.phone && (
              <div className="flex flex-row items-center mt-[10px]">
                <div className="flex items-center justify-center mr-[10px] 
                                bg-white p-[8px] rounded-full 
                                min-w-[36px] min-h-[36px]">
                  <FaPhoneVolume className="text-xl text-[#686D76]" />
                </div>
                <p className="text-[18px]">{item.phone}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">
          {isKorean ? '답변 미리보기.' : 'Answer preview.'}
        </p>
      )}
    </div>
  );

  return (
    <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">미리보기</h3>

      {/* 한국어 */}
      <div
        ref={koreanContainerRef}
        className="overflow-x-auto pb-4"
      >
        {renderCards(
          answer_ko,
          maincategory_ko,
          subcategory_ko,
          true
        )}
      </div>

      {/* 영어 */}
      <div
        ref={englishContainerRef}
        className="overflow-x-auto pb-2 mt-6"
      >
        {renderCards(
          answer_en,
          maincategory_en,
          subcategory_en,
          false
        )}
      </div>
    </div>
  );
};

export default FAQPreview;