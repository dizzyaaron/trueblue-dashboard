import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/themeStore';

export default function InteractiveBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      
      const x = e.clientX;
      const y = e.clientY;
      
      glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${
        isDarkMode ? 
          'rgba(255,255,255,0.03)' : 
          'rgba(0,91,158,0.03)'
      }, transparent 40%)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDarkMode]);

  return (
    <div 
      ref={glowRef}
      className="fixed inset-0 pointer-events-none transition-colors duration-300"
      style={{ zIndex: -1 }}
    />
  );
}