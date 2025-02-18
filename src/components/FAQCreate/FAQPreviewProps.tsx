import React, { useRef, useEffect } from 'react';
import { FaLink, FaPhoneVolume } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';

interface FAQPreviewProps {
  question_ko: string;
  question_en: string;
  answer_ko: { answer: string; url: string; email: string; phone: string; }[];
  answer_en: { answer: string; url: string; email: string; phone: string; }[];
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

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target === koreanContainerRef.current && englishContainerRef.current) {
        englishContainerRef.current.scrollLeft = target.scrollLeft;
      } else if (target === englishContainerRef.current && koreanContainerRef.current) {
        koreanContainerRef.current.scrollLeft = target.scrollLeft;
      }
    };

    const koreanContainer = koreanContainerRef.current;
    const englishContainer = englishContainerRef.current;

    if (koreanContainer) {
      koreanContainer.addEventListener('scroll', handleScroll);
    }
    if (englishContainer) {
      englishContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (koreanContainer) {
        koreanContainer.removeEventListener('scroll', handleScroll);
      }
      if (englishContainer) {
        englishContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  
  return (
    <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">미리보기</h3>
      <div className="flex flex-col gap-6">
        {/* 한국어 컨테이너 */}
        <div ref={koreanContainerRef} className="overflow-x-auto flex flex-nowrap space-x-4 pb-2">
          {answer_ko.length > 0 ? (
            answer_ko.map((item, index) => (
              <div key={index} className="bg-gray-100 font-5medium text-[20px] rounded-[20px] px-[20px] py-[15px] min-w-[365px] w-[365px] flex-shrink-0 break-words inline-block">
                {index === 0 && (
                  <div className="flex flex-row text-[16px] text-[#686D76] items-center rounded-[10px] w-fit mb-[10px]">
                    <h3 className="text-center">{maincategory_ko}</h3>
                    <IoIosArrowForward />
                    <h3 className="font-4regular text-center">{subcategory_ko}</h3>
                  </div>
                )}
                {typeof item.answer === 'string' && (
                  <div className="whitespace-pre-wrap">{item.answer}</div>
                )}
                {(item.url || item.email || item.phone) && (
                  <div className="w-full h-[1px] bg-gray-300 mt-[20px]" />
                )}
                {item.url && (
                  <div
                    className={`flex flex-row ${
                      item.url.length <= 30 ? 'items-center' : 'items-start'
                    } mt-[20px]`}
                  >
                    <FaLink
                      style={{
                        fontSize: '36px',
                        minWidth: '36px',
                        minHeight: '36px',
                      }}
                      className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full"
                    />                    <a href={item.url.startsWith('http') ? item.url : `http://${item.url}`} target="_blank" rel="noopener noreferrer" className="text-[18px] text-[#0A5EB0] cursor-pointer hover:underline break-words">
                      사이트 바로가기
                    </a>
                  </div>
                )}
                {item.email && (
                  <div className="flex flex-row items-center mt-[10px]">
                    <MdOutlineEmail className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full" />
                    <p className="text-[18px]">{item.email}</p>
                  </div>
                )}
                {item.phone && (
                  <div className="flex flex-row items-center mt-[10px]">
                    <FaPhoneVolume className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full" />
                    <p className="text-[18px]">{item.phone}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">한글 답변 미리보기.</p>
          )}
        </div>

        {/* 영어 컨테이너 */}
        <div ref={englishContainerRef} className="overflow-x-auto flex flex-nowrap space-x-4 pb-2">
          {answer_en.length > 0 ? (
            answer_en.map((item, index) => (
              <div key={index} className="bg-gray-100 font-5medium text-[20px] rounded-[20px] px-[20px] py-[15px] min-w-[365px] w-[365px] flex-shrink-0 break-words inline-block">
                {index === 0 && (
                  <div className="flex flex-row text-[16px] text-[#686D76] items-center rounded-[10px] w-fit mb-[10px]">
                    <h3 className="text-center">{maincategory_en}</h3>
                    <IoIosArrowForward />
                    <h3 className="font-4regular text-center">{subcategory_en}</h3>
                  </div>
                )}
                {typeof item.answer === 'string' && (
                  <div className="whitespace-pre-wrap">{item.answer}</div>
                )}
                {(item.url || item.email || item.phone) && (
                  <div className="w-full h-[1px] bg-gray-300 mt-[20px]" />
                )}
                {item.url && (
                  <div
                    className={`flex flex-row ${
                      item.url.length <= 30 ? 'items-center' : 'items-start'
                    } mt-[20px]`}
                  >
                    <FaLink
                      style={{
                        fontSize: '36px',
                        minWidth: '36px',
                        minHeight: '36px',
                      }}
                      className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full"
                    />
                    <a href={item.url.startsWith('http') ? item.url : `http://${item.url}`} target="_blank" rel="noopener noreferrer" className="text-[18px] text-[#0A5EB0] cursor-pointer hover:underline break-words">
                      Visit Site
                    </a>
                  </div>
                )}
                {item.email && (
                  <div className="flex flex-row items-center mt-[10px]">
                    <MdOutlineEmail className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full" />
                    <p className="text-[18px]">{item.email}</p>
                  </div>
                )}
                {item.phone && (
                  <div className="flex flex-row items-center mt-[10px]">
                    <FaPhoneVolume className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full" />
                    <p className="text-[18px]">{item.phone}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-300">영어 답변 미리보기.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPreview;
