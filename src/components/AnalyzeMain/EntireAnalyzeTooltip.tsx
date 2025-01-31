import React from 'react';
import { TooltipProps } from 'recharts';

interface CustomPayload {
  question?: string;
  name: string;
  value: number | string;
  한국어?: number;
  영어?: number;
  startDate?: string;
  endDate?: string;
}

interface EntireAnalyzeTooltipProps extends TooltipProps<number, string> {
  searchSubject: string;
}

const EntireAnalyzeTooltip: React.FC<EntireAnalyzeTooltipProps> = ({ active, payload, label, searchSubject }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CustomPayload;

    const dynamicColor = () => {
      if (searchSubject === 'frequency') return '#8884d8';
      if (searchSubject === 'feedback') return '#82ca9d';
      return '#000';
    };

    const color = dynamicColor();

    if (searchSubject === 'language') {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label" >{`기간: ${data.startDate} ~ ${data.endDate}`}</p>
          <p className="label" style={{ color: '#8884d8' }}>{`한국어: ${data.한국어}`}</p>
          <p className="intro" style={{ color: '#82ca9d' }}>{`영어: ${data.영어}`}</p>
        </div>
      );
    }

    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label" style={{ color, whiteSpace: 'pre-wrap' }}>{`Q: ${data.question}`}</p>
        <p className="intro" style={{ color }}>{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default EntireAnalyzeTooltip;