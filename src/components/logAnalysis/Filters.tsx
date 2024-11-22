import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAdjustOtherDate from "../../hooks/logAnalysis/useAdjustOtherDate";
import { LogRequest, Mode } from "../../types/logAnalysis";

interface FiltersProps {
  filters: LogRequest;
  setFilters: React.Dispatch<React.SetStateAction<LogRequest>>;
  mode: Mode;
  setMode: (newMode: Mode) => void;
  disableDates: (date: Date, type: "start" | "end") => boolean;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  mode,
  setMode,
  disableDates,
}) => {
  const adjustOtherDate = useAdjustOtherDate(filters, setFilters);

  const renderAdditionalOptions = () => {
    if (mode === "language") return null;
    return (
      <>
        <label className="block mb-2">
          정렬 순서:
          <select
            value={filters.sortOrder}
            onChange={(e) =>
              setFilters({
                ...filters,
                sortOrder: parseInt(e.target.value, 10),
              })
            }
            className="ml-2 p-2 border rounded"
          >
            <option value={0}>오름차순</option>
            <option value={1}>내림차순</option>
          </select>
        </label>

        <label className="block mb-2">
          한번에 볼 개수:
          <input
            type="number"
            min="1"
            value={filters.limit}
            onChange={(e) =>
              setFilters({
                ...filters,
                limit: Math.max(parseInt(e.target.value, 10), 1),
              })
            }
            className="ml-2 p-2 border rounded"
          />
        </label>
      </>
    );
  };

  return (
    <div className="mb-6">
      <label className="block mb-2">
        검색 주제:
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="ml-2 p-2 border rounded"
        >
          <option value="frequency">FAQ 검색 빈도</option>
          <option value="feedback">FAQ 피드백 점수</option>
          <option value="language">검색 언어 빈도</option>
        </select>
      </label>

      <label className="block mb-2">
        시작 일자:
        <DatePicker
          selected={filters.startDate ? new Date(filters.startDate) : null}
          onChange={(date: Date | null) => {
            if (date) {
              if (filters.endDate && date > new Date(filters.endDate)) {
                adjustOtherDate(date, "start");
              }
              setFilters({
                ...filters,
                startDate: date.toISOString().split("T")[0],
              });
            }
          }}
          filterDate={(date) => disableDates(date, "start")}
          dateFormat="yyyy-MM-dd"
          className="ml-2 p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        종료 일자:
        <DatePicker
          selected={filters.endDate ? new Date(filters.endDate) : null}
          onChange={(date: Date | null) => {
            if (date) {
              if (filters.startDate && date < new Date(filters.startDate)) {
                adjustOtherDate(date, "end");
              }
              setFilters({
                ...filters,
                endDate: date.toISOString().split("T")[0],
              });
            }
          }}
          filterDate={(date) => disableDates(date, "end")}
          dateFormat="yyyy-MM-dd"
          className="ml-2 p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        검색 주기:
        <select
          value={filters.period}
          onChange={(e) =>
            setFilters({
              ...filters,
              period: e.target.value,
            })
          }
          className="ml-2 p-2 border rounded"
        >
          <option value="day">하루</option>
          <option value="week">일주일</option>
          <option value="month">한 달</option>
        </select>
      </label>

      {renderAdditionalOptions()}
    </div>
  );
};

export default Filters;
