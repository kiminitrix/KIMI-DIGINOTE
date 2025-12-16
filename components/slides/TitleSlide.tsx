import React from 'react';
import { SlideContent } from '../../types';
import { motion } from 'framer-motion';

export const TitleSlide: React.FC<{ content: SlideContent }> = ({ content }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-blue-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 tracking-widest uppercase">
          Presentation
        </span>
        <h1 className="text-6xl font-bold mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
          {content.title}
        </h1>
        {content.subtitle && (
          <p className="text-2xl text-blue-200/80 font-light max-w-3xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        )}
      </motion.div>
      
      <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};
