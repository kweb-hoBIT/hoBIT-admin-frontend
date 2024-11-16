import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-lg font-medium">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md mt-1"
      required
    />
  </div>
);

export default InputField;
