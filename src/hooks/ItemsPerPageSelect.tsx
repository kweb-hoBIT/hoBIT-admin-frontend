type Props = {
  itemsPerPage: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const ItemsPerPageSelect = ({ itemsPerPage, onChange }: Props) => (
  <select
    value={itemsPerPage}
    onChange={onChange}
    className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {[4, 6, 8, 10].map((n) => (
      <option key={n} value={n}>
        {n}개씩 보기
      </option>
    ))}
  </select>
);
