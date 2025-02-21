import React, { useRef, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa6';
import { IoIosArrowForward } from 'react-icons/io';

interface Answer {
  title?: string;
  answer: string;
  url: string;
  map: { latitude: string; longitude: string; };
  email?: string;
  phone?: string;
  image?: string;
}

interface SeniorFAQPreviewProps {
  maincategory_ko: string;
  maincategory_en: string;
  subcategory_ko: string;
  subcategory_en: string;
  detailcategory_ko: string;
  detailcategory_en: string;
  answer_ko: Answer[];
  answer_en: Answer[];
  manager: string;
}

const SeniorFAQPreview: React.FC<SeniorFAQPreviewProps> = ({
  maincategory_ko,
  maincategory_en,
  subcategory_ko,
  subcategory_en,
  detailcategory_ko,
  detailcategory_en,
  answer_ko,
  answer_en,
  manager,
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
              <div key={index} className="font-5medium text-[20px] bg-[#FFEFEF] mt-[10px] rounded-[20px] px-[20px] py-[15px] min-w-[365px] w-[365px] flex-shrink-0 break-words inline-block">
                {index === 0 && (
                  <div className="flex flex-row text-[16px] text-[#686D76] items-center rounded-[10px] w-fit mb-[10px]">
                    <h3 className="text-center">{maincategory_ko}</h3>
                    <IoIosArrowForward />
                    <h3 className="font-4regular text-center">{subcategory_ko}</h3>
                    <IoIosArrowForward />
                    <h3 className="font-4regular text-center">{detailcategory_ko}</h3>
                  </div>
                )}
                {item.title && (
                  <p className="font-7bold text-[20px] mb-[10px]">{item.title}</p>
                )}
                {item.image && (
                  <div className="mt-[20px]">
                    <img
                      src={item.image}
                      alt="관련 이미지"
                      className="w-full h-auto rounded-[10px] object-cover"
                    />
                  </div>
                )}
                {typeof item.answer === 'string' && (
                  <div className="whitespace-pre-wrap">{item.answer}</div>
                )}
                {(item.url || item.email || item.phone) && (
                  <div className="w-full h-[1px] bg-gray-300 mt-[20px]" />
                )}
                {item.url && (
                    <div className="flex flex-row items-center mt-[20px]">
                      <FaLink className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full" />
                    <a href={item.url.startsWith('http') ? item.url : `http://${item.url}`} target="_blank" rel="noopener noreferrer" className="text-[18px] text-[#0A5EB0] cursor-pointer hover:underline break-words">
                      사이트 바로가기
                    </a>
                  </div>
                )}
                {(item.map.latitude || item.map.longitude) && (
                  <div className="flex flex-row items-center mt-[10px]">
                    <FaMapMarkerAlt  className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full" />
                    <a
                      href="https://www.korea.ac.kr/campusMap/ko/view.do"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      고려대학교 캠퍼스맵
                    </a>
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
              <div key={index} className="font-5medium text-[20px] bg-[#FFEFEF] mt-[10px] rounded-[20px] px-[20px] py-[15px] min-w-[365px] w-[365px] flex-shrink-0 break-words inline-block">
                {index === 0 && (
                  <div className="flex flex-row text-[16px] text-[#686D76] items-center rounded-[10px] w-fit mb-[10px]">
                    <h3 className="text-center">{maincategory_en}</h3>
                    <IoIosArrowForward />
                    <h3 className="font-4regular text-center">{subcategory_en}</h3>
                    <IoIosArrowForward />
                    <h3 className="font-4regular text-center">{detailcategory_en}</h3>
                  </div>
                )}
                {item.title && (
                  <p className="font-7bold text-[20px] mb-[10px]">{item.title}</p>
                )}
                {item.image && (
                  <div className="mt-[20px]">
                    <img
                      src={item.image}
                      alt="Related Image"
                      className="w-full h-auto rounded-[10px] object-cover"
                    />
                  </div>
                )}
                {typeof item.answer === 'string' && (
                  <div className="whitespace-pre-wrap">{item.answer}</div>
                )}
                {(item.url || item.email || item.phone) && (
                  <div className="w-full h-[1px] bg-gray-300 mt-[20px]" />
                )}
                {item.url && (
                    <div className="flex flex-row items-center mt-[20px]">
                      <FaLink className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full" />
                    <a href={item.url.startsWith('http') ? item.url : `http://${item.url}`} target="_blank" rel="noopener noreferrer" className="text-[18px] text-[#0A5EB0] cursor-pointer hover:underline break-words">
                      Visit Site
                    </a>
                  </div>
                )}
                {(item.map.latitude || item.map.longitude) && (
                  <div className="flex flex-row items-center mt-[10px]">
                    <FaMapMarkerAlt  className="mr-[10px] text-[36px] text-[#686D76] bg-white p-[8px] rounded-full" />
                    <a
                      href="https://www.korea.ac.kr/campusMap/ko/view.do"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Korea University Campus Map
                    </a>
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

export default SeniorFAQPreview;