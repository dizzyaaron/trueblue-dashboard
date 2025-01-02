import React from 'react';
import { Award, Target, Wrench, Users } from 'lucide-react';
import AchievementBadge from '../AchievementBadge';

export default function Achievements() {
  const achievements = [
    {
      title: "Customer Champion",
      description: "Complete 50 jobs with 5-star ratings",
      progress: 75,
      icon: <Users className="w-6 h-6" />,
      isCompleted: false
    },
    {
      title: "Speed Demon",
      description: "Complete 10 jobs ahead of schedule",
      progress: 100,
      icon: <Target className="w-6 h-6" />,
      isCompleted: true
    },
    {
      title: "Master Craftsman",
      description: "Complete jobs in 5 different categories",
      progress: 60,
      icon: <Wrench className="w-6 h-6" />,
      isCompleted: false
    }
  ];

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-dark-text">
        <Award className="w-5 h-5 text-primary" />
        Achievements
      </h2>
      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.title} {...achievement} />
        ))}
      </div>
    </div>
  );
}