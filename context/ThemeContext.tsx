"use client"
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'minimal',
  setTheme: (theme: string) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('minimal');

  useEffect(() => {
    // تحديث الـ attribute في الـ HTML ليقرأه ملف الـ CSS
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);