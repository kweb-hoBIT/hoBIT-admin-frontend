import React from 'react';

interface FaqReaderProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className: string;
  readOnly: boolean;
}

const FaqReader: React.FC<FaqReaderProps> = ({ id, label, type, value, onChange, placeholder, className, readOnly }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-lg font-medium">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      required
      readOnly={readOnly}
    />
  </div>
);

export default FaqReader;
