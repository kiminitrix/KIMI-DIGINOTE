import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { PresentationViewer } from './components/PresentationViewer';
import { FileData, PresentationData } from './types';
import { generatePresentation } from './services/geminiService';
import { Layout, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'viewing' | 'error'>('idle');
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFileProcess = async (file: FileData) => {
    setStatus('processing');
    try {
      const data = await generatePresentation(file);
      setPresentation(data);
      setStatus('viewing');
    } catch (error) {
      setStatus('error');
      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  const resetApp = () => {
    setPresentation(null);
    setStatus('idle');
    setErrorMsg('');
  };

  if (status === 'viewing' && presentation) {
    return <PresentationViewer data={presentation} onClose={resetApp} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
       {/* Background decorations */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-3xl"></div>
       </div>

       {/* Navbar */}
       <nav className="w-full p-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
             </div>
             KIMI DIGINOTE
          </div>
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Documentation</a>
       </nav>

       {/* Main Content */}
       <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="text-center mb-12 max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
               Turn Documents into <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                 Interactive Slides
               </span>
            </h1>
            <p className="text-lg text-slate-400">
               Upload your PDF, Text, or CSV files. Our AI analyzes the content and instantly generates a professionally designed presentation for you.
            </p>
          </div>

          <div className="w-full flex justify-center">
             {status === 'error' ? (
                <div className="text-center bg-red-500/10 p-8 rounded-2xl border border-red-500/20 max-w-lg">
                   <h3 className="text-red-400 font-semibold text-lg mb-2">Generation Failed</h3>
                   <p className="text-slate-300 mb-6">{errorMsg}</p>
                   <button 
                     onClick={resetApp}
                     className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                   >
                     Try Again
                   </button>
                </div>
             ) : (
                <FileUpload 
                  onFileProcessed={handleFileProcess} 
                  isLoading={status === 'processing'} 
                />
             )}
          </div>
       </main>

       {/* Footer */}
       <footer className="w-full p-6 text-center text-slate-600 text-sm relative z-10">
          <p>Powered by Google Gemini 2.5 Flash • Next.js & React</p>
       </footer>
    </div>
  );
};

export default App;