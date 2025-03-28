import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import EntireAnalyzeTooltip from './EntireAnalyzeTooltip';

interface EntireAnalyzeGraphProps {
  searchSubject: string;
  currentPageData: any[];
}

const EntireAnalyzeGraph: React.FC<EntireAnalyzeGraphProps> = ({ searchSubject, currentPageData }) => {
  const transformedData = currentPageData
    .map((item) => {
      if (searchSubject === 'language') {
        return item.data.map((subItem: any) => ({
          date: `${item.startDate}`,
          startDate: item.startDate,
          endDate: item.endDate,
          한국어: parseInt(item.data[0]?.ko_frequency || '0', 10),
          영어: parseInt(item.data[0]?.en_frequency || '0', 10),
        }));
      } else if (searchSubject === 'frequency' && item.data) {
        return item.data.map((subItem: any) => ({
          faq_id_label: `${subItem.faq_id}번`,
          횟수: subItem.count,
          question: subItem.question_ko,
        }));
      } else if (searchSubject === 'feedback' && item.data) {
        return item.data.map((subItem: any) => ({
          faq_id_label: `${subItem.faq_id}번`,
          평균점수: parseFloat(subItem.score_average), 
          question: subItem.question_ko,
        }));
      }
      return null; 
    })
    .flat()
    .filter(Boolean);

  const maxValue = Math.max(...transformedData.map((item) => { // 최대값을 한계로 설정해도록
    if (searchSubject === 'language') {
      return Math.max(item.한국어, item.영어);
    } else if (searchSubject === 'frequency') {
      return item.횟수;
    } else if (searchSubject === 'feedback') {
      return item.평균점수;
    }
    return 0;
  }));

  return (
    <div className="analyze-graph"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2 className="text-xl font-semibold text-center mb-4">분석 결과 그래프</h2>
      <ResponsiveContainer width="95%" height={400}>
        <BarChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            domain={searchSubject === 'feedback' ? [-1, 1] : [0, maxValue]} // 검색 주제가 피드백이면 가독성을 위해 최소/최댓값을 -1/1로 고정
            label={{
              value: searchSubject === 'feedback' ? '점수' : '횟수',
              position: 'insideLeft',
              offset: 0,
            }}
            tickFormatter={(value) => Math.round(value).toString()} // 정수 단위로만 나누어지도록
            allowDecimals={false}
          />
          <Tooltip content={<EntireAnalyzeTooltip searchSubject={searchSubject} />} />
          <Legend />
          {searchSubject === 'language' && (
            <>
              <XAxis dataKey="date" textAnchor="middle" />
              <Bar dataKey="한국어" fill="#8884d8" />
              <Bar dataKey="영어" fill="#82ca9d" />
            </>
          )}
          {searchSubject === 'frequency' && (
            <>
              <XAxis dataKey="faq_id_label" />
              <Bar dataKey="횟수" fill="#8884d8" />
            </>
          )}
          {searchSubject === 'feedback' && (
            <>
              <XAxis dataKey="faq_id_label" />
              <Bar dataKey="평균점수" fill="#82ca9d" />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EntireAnalyzeGraph;