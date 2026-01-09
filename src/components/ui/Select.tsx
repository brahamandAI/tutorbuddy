import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options?: Option[];
}

export const Select = ({ label, value, onChange, options = [] }: SelectProps) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium mb-1">{label}</label>}
    <select
      className="border rounded p-2 w-full focus:outline-none focus:ring focus:border-blue-400"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options?.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      )) || []}
    </select>
  </div>
); 