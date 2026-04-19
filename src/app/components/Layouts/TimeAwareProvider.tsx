"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'morning' | 'afternoon' | 'evening' | 'night';

const ThemeContext = createContext<{ mode: ThemeMode }>({ mode: 'morning' });

export const TimeAwareProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('morning');

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) setMode('morning');      // 5 AM - 12 PM
      else if (hour >= 12 && hour < 17) setMode('afternoon'); // 12 PM - 5 PM
      else if (hour >= 17 && hour < 21) setMode('evening');   // 5 PM - 9 PM
      else setMode('night');                                // 9 PM - 5 AM
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // تحديث كل دقيقة
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode }}>
      <div className={`theme-${mode} transition-colors duration-[2000ms] ease-in-out min-h-screen`}>
 {    /*  <div className="fixed top-20 left-4 z-[999] flex flex-col gap-2 bg-black/50 p-2 rounded-xl backdrop-blur-md border border-white/10">
          <p className="text-[10px] text-white/50 font-mono text-center">Dev Theme Switcher</p>
          {(['morning', 'afternoon', 'evening', 'night'] as ThemeMode[]).map((m) => (
            <button 
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-[10px] uppercase rounded-lg border transition-all ${
                mode === m ? 'bg-primary text-black border-primary' : 'bg-white/5 text-white border-white/10'
              }`}
            >
              {m}
            </button>
          ))}
        </div>*/}
              {children}
      </div>
      
    </ThemeContext.Provider>
  );
};

export const useTimeTheme = () => useContext(ThemeContext);