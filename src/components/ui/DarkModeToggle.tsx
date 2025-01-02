import React from 'react';
import { useThemeStore } from '../../store/themeStore';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="toggle-switch">
      <input 
        type="checkbox" 
        className="checkbox" 
        id="darkModeToggle"
        checked={isDarkMode}
        onChange={toggleDarkMode}
      />
      <label className="switch-label" htmlFor="darkModeToggle">
        <span className="slider"></span>
      </label>
    </div>
  );
}