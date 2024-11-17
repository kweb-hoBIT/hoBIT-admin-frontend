import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, onChange, placeholder, className }) => (
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
    />
  </div>
);

export default InputField;
