import React from "react";

interface FilterProps {
  filter: "unresolved" | "all";
  onFilterChange: (filterValue: "unresolved" | "all") => void;
}

const UserFeedbackFilter: React.FC<FilterProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="relative mt-4">
      <div className="flex items-center justify-center mt-8 text-2xl">
        <div className="flex-1 text-right pr-4">
          <span
            onClick={() => onFilterChange("unresolved")}
            className={`cursor-pointer font-semibold transition-colors duration-200 ${
              filter === "unresolved"
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            해결되지 않은 피드백
          </span>
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        <div className="flex-1 text-left pl-4">
          <span
            onClick={() => onFilterChange("all")}
            className={`cursor-pointer font-semibold transition-colors duration-200 ${
              filter === "all"
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            전체 피드백
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserFeedbackFilter;
