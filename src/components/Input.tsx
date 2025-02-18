// 📂 components/Input.tsx
import React from "react";

interface InputProps {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  
}

const Input: React.FC<InputProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input className="border p-2 rounded mt-1" value={value} onChange={onChange} title={label} placeholder={label} />
    </div>
  );
};

export default Input;