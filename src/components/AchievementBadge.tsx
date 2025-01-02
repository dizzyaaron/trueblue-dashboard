import React from 'react';
import { Award } from 'lucide-react';

interface AchievementBadgeProps {
  title: string;
  description: string;
  progress: number;
  icon?: React.ReactNode;
  isCompleted?: boolean;
}

export default function AchievementBadge({
  title,
  description,
  progress,
  icon,
  isCompleted = false,
}: AchievementBadgeProps) {
  return (
    <div className={`bg-surface rounded-xl p-4 border-2 ${
      isCompleted ? 'border-primary' : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${
          isCompleted ? 'bg-primary text-white' : 'bg-gray-100'
        }`}>
          {icon || <Award className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-text">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{progress}%</span>
              {isCompleted && (
                <span className="text-xs text-primary font-medium">Completed!</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}