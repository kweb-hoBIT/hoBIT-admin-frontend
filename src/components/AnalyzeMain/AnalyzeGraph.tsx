import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AnalyzeGraphProps {
  searchSubject: string;
  currentPageData: any[];
}

const AnalyzeGraph: React.FC<AnalyzeGraphProps> = ({ searchSubject, currentPageData }) => {
  const transformedData = currentPageData
    .map((item) => {
      if (searchSubject === 'language') {
        return {
          date: `${item.startDate}`,
          한국어: parseInt(item.ko_frequency || '0', 10),
          영어: parseInt(item.en_frequency || '0', 10),
        };
      } else if (searchSubject === 'frequency' && item.data) {
        return item.data.map((subItem: any) => ({
          faq_id_label: `${subItem.faq_id}번 FAQ`,
          횟수: subItem.count,
          question: subItem.question_ko,
        }));
      } else if (searchSubject === 'feedback' && item.data) {
        return item.data.map((subItem: any) => ({
          faq_id_label: `${subItem.faq_id}번 FAQ`,
          평균점수: parseFloat(subItem.score_average), 
          question: subItem.question_ko,
        }));
      }
      return null; 
    })
    .flat()
    .filter(Boolean); 

  return (
    <div className="analyze-graph">
      <h2 className="text-xl font-semibold text-center mb-4">분석 결과 그래프</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            domain={searchSubject === 'feedback' ? [-1, 1] : [0, 'auto']} // Y축 범위 설정
            label={{
              value: searchSubject === 'feedback' ? '평균 점수' : '횟수',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
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

export default AnalyzeGraph;
