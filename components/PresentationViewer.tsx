import React, { useState, useEffect } from 'react';
import { PresentationData } from '../types';
import { SlideRenderer } from './SlideRenderer';
import { ChevronLeft, ChevronRight, Maximize2, X, Download, Loader2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportPresentation } from '../services/exportService';

interface PresentationViewerProps {
  data: PresentationData;
  onClose: () => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({ data, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showOutline, setShowOutline] = useState(false);

  const nextSlide = () => {
    if (currentSlideIndex < data.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportPresentation(data);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to generate PPTX. See console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-screen w-full bg-slate-900'}`}>
      {/* Toolbar - Hide in Fullscreen unless hovered (simplified for now: show if not fullscreen) */}
      {!isFullscreen && (
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowOutline(!showOutline)}
              className={`p-2 rounded-full transition-colors ${showOutline ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              title="Toggle Slide Outline"
            >
              <List className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
               <h1 className="text-white font-semibold truncate max-w-md text-sm leading-tight">{data.title}</h1>
               <span className="text-[10px] text-slate-400">
                  {data.theme} theme
               </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
            >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                {isExporting ? "Exporting..." : "Export PPTX"}
            </button>
            <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 relative flex overflow-hidden bg-black">
        
        {/* Outline Sidebar */}
        <AnimatePresence>
          {showOutline && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 z-40 flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Slide Outline</h3>
                <button onClick={() => setShowOutline(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {data.slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlideIndex(index);
                      // Optional: setShowOutline(false); keeping it open feels better for navigation
                    }}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all flex items-start gap-3 group ${
                      currentSlideIndex === index 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className={`mt-0.5 text-xs font-mono font-bold ${currentSlideIndex === index ? 'text-blue-200' : 'text-slate-600 group-hover:text-slate-500'}`}>
                        {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="line-clamp-2 font-medium leading-relaxed">{slide.content.title || "Untitled Slide"}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide Viewport */}
        <main className="flex-1 relative flex items-center justify-center w-full h-full">
          {/* Aspect Ratio Container (16:9) */}
          <div className={`relative transition-all duration-300 ${isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl aspect-video shadow-2xl'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-white overflow-hidden"
              >
                <SlideRenderer slide={data.slides[currentSlideIndex]} />
              </motion.div>
            </AnimatePresence>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-200/20 w-full z-20">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${((currentSlideIndex + 1) / data.slides.length) * 100}%` }}
              />
            </div>
            
            {/* Slide Counter */}
            <div className="absolute bottom-4 right-6 text-slate-400/50 text-sm font-mono z-20 select-none">
              {currentSlideIndex + 1} / {data.slides.length}
            </div>
          </div>
        </main>

        {/* Navigation Controls (Floating) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
          <button 
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="p-4 rounded-full bg-slate-800/80 backdrop-blur text-white hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-800 transition-all shadow-lg border border-slate-700 hover:border-blue-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentSlideIndex === data.slides.length - 1}
            className="p-4 rounded-full bg-slate-800/80 backdrop-blur text-white hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-800 transition-all shadow-lg border border-slate-700 hover:border-blue-500"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
