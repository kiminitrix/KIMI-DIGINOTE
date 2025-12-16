import React from 'react';
import { SlideContent } from '../../types';
import { motion } from 'framer-motion';

export const ContentWithImage: React.FC<{ content: SlideContent }> = ({ content }) => {
  return (
    <div className="h-full w-full flex bg-slate-50 text-slate-900 overflow-hidden">
      {/* Text Section */}
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-slate-800 mb-8 border-l-4 border-blue-600 pl-6"
        >
          {content.title}
        </motion.h2>
        
        <ul className="space-y-4 pl-6">
          {content.points?.map((point, idx) => (
            <motion.li 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="flex items-start text-lg text-slate-600 leading-relaxed"
            >
              <span className="mr-3 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
              {point}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Image Section */}
      <div className="w-1/2 bg-slate-200 relative overflow-hidden">
        <motion.img 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={content.image_prompt ? `https://picsum.photos/800/800?random=${Math.floor(Math.random() * 1000)}` : 'https://picsum.photos/800/800'}
          alt="Slide Visual"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
           <p className="text-white/60 text-xs italic font-mono max-w-md">
             AI Visual Prompt: {content.image_prompt || "Abstract concept visualization"}
           </p>
        </div>
      </div>
    </div>
  );
};
