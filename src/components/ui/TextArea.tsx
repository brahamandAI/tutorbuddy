import React from 'react';

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

export const TextArea = ({ label, value, onChange, rows = 3 }: TextAreaProps) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium mb-1">{label}</label>}
    <textarea
      className="border rounded p-2 w-full focus:outline-none focus:ring focus:border-blue-400 min-h-[2.5rem]"
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
    />
  </div>
); 