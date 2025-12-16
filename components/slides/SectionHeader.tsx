import React from 'react';
import { SlideContent } from '../../types';
import { motion } from 'framer-motion';

export const SectionHeader: React.FC<{ content: SlideContent }> = ({ content }) => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-slate-900 text-white relative">
      <div className="absolute inset-0 bg-blue-600/10 clip-path-polygon"></div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="z-10 text-center max-w-4xl px-8"
      >
        <div className="w-24 h-1 bg-blue-500 mb-8 mx-auto"></div>
        <h2 className="text-6xl font-black mb-6 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          {content.title}
        </h2>
        {content.subtitle && (
          <p className="text-xl text-slate-400 font-light italic">
             — {content.subtitle} —
          </p>
        )}
      </motion.div>
    </div>
  );
};
