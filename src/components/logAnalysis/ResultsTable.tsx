import React from "react";
import { LogResponse, GroupedLogData, LogEntry, Mode } from "../../types/logAnalysis";

interface ResultsTableProps {
  data: LogResponse["data"]["logData"]["groupData"];
  mode: Mode;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data, mode }) => {
  return (
    <div
      style={{
        maxHeight: "400px",
        overflowY: "auto",
        border: "1px solid #ccc",
      }}
    >
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            {mode === "language" ? (
              <>
                <th className="border p-2">한국어 횟수</th>
                <th className="border p-2">영어 횟수</th>
              </>
            ) : (
              <>
                <th className="border p-2">순위</th>
                <th className="border p-2">FAQ ID</th>
                <th className="border p-2">FAQ 질문 내용</th>
                {mode === "frequency" && <th className="border p-2">검색 횟수</th>}
                {mode === "feedback" && <th className="border p-2">평균 점수</th>}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((group: GroupedLogData, groupIndex: number) => (
              <React.Fragment key={groupIndex}>
                {/* 그룹 시작/끝 날짜 */}
                <tr className="bg-gray-100">
                  <td colSpan={mode === "language" ? 4 : 6} className="text-center p-2 font-bold">
                    {group.startDate} ~ {group.endDate}
                  </td>
                </tr>
                {mode === "language" ? (
                  <tr>
                    <td className="border p-2">{group.ko_frequency}</td>
                    <td className="border p-2">{group.en_frequency}</td>
                  </tr>
                ) : (
                  group.data?.map((entry: LogEntry, entryIndex: number) => (
                    <tr key={entryIndex}>
                      <td className="border p-2">{entry.rank}</td>
                      <td className="border p-2">{entry.faq_id}</td>
                      <td className="border p-2">{entry.question_ko}</td>
                      {mode === "frequency" && (
                        <td className="border p-2">{entry.count}</td>
                      )}
                      {mode === "feedback" && (
                        <td className="border p-2">
                          {entry.score_average?.toFixed(2)}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={mode === "language" ? 4 : 6}
                className="text-center p-2"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
