import React, { useRef, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa6';
import { IoIosArrowForward } from 'react-icons/io';

interface Answer {
  title?: string;
  answer: string;
  url: string;
  map: { latitude: string; longitude: string };
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

const campusMapUrl = (keyword: string) =>
  `https://www.korea.ac.kr/campusMap/ko/view.do?srchWrd=${encodeURIComponent(
    keyword
  )}`;

const SeniorFAQPreview: React.FC<SeniorFAQPreviewProps> = ({
  maincategory_ko,
  maincategory_en,
  subcategory_ko,
  subcategory_en,
  detailcategory_ko,
  detailcategory_en,
  answer_ko,
  answer_en,
}) => {
  const koreanContainerRef = useRef<HTMLDivElement>(null);
  const englishContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target === koreanContainerRef.current && englishContainerRef.current) {
        englishContainerRef.current.scrollLeft = target.scrollLeft;
      } else if (
        target === englishContainerRef.current &&
        koreanContainerRef.current
      ) {
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

  const renderCard = (
    item: Answer,
    index: number,
    category: { main: string; sub: string; detail: string },
    isKorean: boolean
  ) => (
    <div
      key={index}
      className="font-5medium text-base md:text-lg bg-[#FFEFEF] mt-[10px] rounded-[20px] px-[20px] py-[15px] w-full max-w-[330px] md:max-w-none md:w-[350px] break-words flex-shrink-0"
    >
      {index === 0 && (
        <div className="flex flex-wrap text-sm md:text-base text-[#686D76] items-center mb-[10px]">
          <h3>{category.main}</h3>
          <IoIosArrowForward className="mx-1" />
          <h3>{category.sub}</h3>
          <IoIosArrowForward className="mx-1" />
          <h3>{category.detail}</h3>
        </div>
      )}

      {index === 0 && item.title && (
        <p className="font-7bold text-base md:text-lg mb-[15px] break-words">
          {item.title}
        </p>
      )}

      {item.image && (
        <img
          src={item.image}
          alt="related"
          className="w-full h-auto rounded-[10px] object-cover mt-[15px]"
        />
      )}

      <div className="mt-[10px] whitespace-pre-wrap">{item.answer}</div>

      {(item.url || item.map?.latitude || item.map?.longitude) && (
        <div className="w-full h-[1px] bg-gray-300 mt-[20px]" />
      )}

      {item.url && (
        <div className="flex flex-row items-center mt-[20px]">
          <div className="flex items-center justify-center mr-[10px] bg-white p-[8px] rounded-full flex-shrink-0">
            <FaLink className="text-xl text-[#686D76]" />
          </div>
          <a
            href={
              item.url.startsWith('http')
                ? item.url
                : `http://${item.url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-base md:text-lg text-[#0A5EB0] hover:underline break-all"
          >
            {isKorean ? '사이트 바로가기' : 'Visit Site'}
          </a>
        </div>
      )}

      {(item.map?.latitude || item.map?.longitude) && (
        <div className="flex flex-row items-center mt-[10px]">
          <div className="flex items-center justify-center mr-[10px] bg-white p-[8px] rounded-full flex-shrink-0">
            <FaMapMarkerAlt className="text-xl text-[#686D76]" />
          </div>
          <a
            href={campusMapUrl(category.detail)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base md:text-lg text-[#0A5EB0] hover:underline"
          >
            {isKorean
              ? '고려대학교 캠퍼스맵'
              : 'Korea University Campus Map'}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <h3 className="text-xl font-bold mb-4">미리보기</h3>

      {/* 한국어 */}
      <div
        ref={koreanContainerRef}
        className="flex flex-col md:flex-row md:overflow-x-auto md:items-start gap-3"
      >
        {answer_ko.map((item, idx) =>
          renderCard(
            item,
            idx,
            {
              main: maincategory_ko,
              sub: subcategory_ko,
              detail: detailcategory_ko,
            },
            true
          )
        )}
      </div>

      {/* 영어 */}
      <div
        ref={englishContainerRef}
        className="flex flex-col md:flex-row md:overflow-x-auto md:items-start gap-3 mt-6"
      >
        {answer_en.map((item, idx) =>
          renderCard(
            item,
            idx,
            {
              main: maincategory_en,
              sub: subcategory_en,
              detail: detailcategory_en,
            },
            false
          )
        )}
      </div>
    </div>
  );
};

export default SeniorFAQPreview;