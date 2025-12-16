import React from 'react';
import { SlideContent } from '../../types';
import { motion } from 'framer-motion';

export const BulletPoints: React.FC<{ content: SlideContent }> = ({ content }) => {
  return (
    <div className="h-full w-full p-16 bg-white text-slate-900 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-bl-full opacity-50 z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <h2 className="text-5xl font-bold text-slate-900 mb-12 tracking-tight">
          {content.title}
        </h2>
        
        <div className="grid grid-cols-1 gap-6 max-w-4xl">
          {content.points?.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-100"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm mr-4 flex-shrink-0">
                {idx + 1}
              </span>
              <p className="text-xl text-slate-700 font-medium">{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
