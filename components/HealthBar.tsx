
import React from 'react';

interface HealthBarProps {
  currentValue: number;
  maxValue: number;
  label: string;
  barColorClass?: string;
}

export const HealthBar: React.FC<HealthBarProps> = ({ currentValue, maxValue, label, barColorClass }) => {
  const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
  const healthColor = barColorClass 
    ? barColorClass 
    : percentage > 60 ? 'bg-green-500' : percentage > 30 ? 'bg-yellow-500' : 'bg-red-600';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-lg font-bold text-gray-200">{label}</span>
        <span className="text-lg font-mono text-white">{`${Math.max(0, Math.round(currentValue))} / ${maxValue}`}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-6 border-2 border-gray-600 shadow-inner">
        <div
          className={`${healthColor} h-full rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};