import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  animate?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className = '',
  animate = false 
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? 
    parseFloat(value.replace(/[^0-9.-]+/g, "")) : 
    value;

  useEffect(() => {
    if (animate && typeof numericValue === 'number') {
      const duration = 1500;
      const steps = 60;
      const stepValue = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        if (current < numericValue) {
          current += stepValue;
          setDisplayValue(Math.min(current, numericValue));
        } else {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(numericValue);
    }
  }, [numericValue, animate]);

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${
      animate ? 'animate-pulse-subtle' : ''
    } ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-2">
            {typeof value === 'string' ? 
              `$${displayValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 
              displayValue}
          </p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last month</span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}