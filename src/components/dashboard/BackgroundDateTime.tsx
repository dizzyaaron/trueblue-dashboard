import React, { useState, useEffect } from 'react';

export default function BackgroundDateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-end p-12 pointer-events-none select-none z-0">
      <div className="text-right">
        <p className="text-8xl font-extralight text-gray-200/10 dark:text-gray-700/10">
          {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-3xl font-light text-gray-200/10 dark:text-gray-700/10">
          {dateTime.toLocaleDateString([], { 
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
}