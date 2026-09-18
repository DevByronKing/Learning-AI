'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollTop > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-4 pointer-events-none scale-90'
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Voltar ao topo da página"
        title={`Voltar ao topo (${scrollProgress}% rolado)`}
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full 
                   bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 
                   shadow-lg shadow-black/10 dark:shadow-black/40 hover:shadow-blue-500/20 
                   hover:border-blue-500/50 active:scale-90 transition-all duration-200"
      >
        {/* SVG Progress Ring */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="transparent"
            className="text-slate-200 dark:text-slate-800"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-blue-600 dark:text-blue-400 transition-all duration-150 ease-out"
          />
        </svg>

        {/* Center Icon */}
        <span className="absolute flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:-translate-y-0.5 transition-transform duration-200">
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
      </button>
    </div>
  );
};
