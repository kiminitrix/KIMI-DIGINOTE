import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { FileData } from '../types';
import { readFileAsBase64, isValidFileType } from '../utils/fileHelpers';

interface FileUploadProps {
  onFileProcessed: (fileData: FileData) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!isValidFileType(file)) {
      setError("Unsupported file type. Please upload PDF, TXT, or CSV.");
      return;
    }
    
    // Warn about DOCX not being supported in this specific frontend-only demo if strictly required
    if (file.type.includes('word')) {
         setError("DOCX not supported in this demo. Please convert to PDF.");
         return;
    }

    try {
      const fileData = await readFileAsBase64(file);
      onFileProcessed(fileData);
    } catch (err) {
      console.error(err);
      setError("Failed to read file.");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,.txt,.csv"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
            {isLoading ? (
               <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <Upload className="w-8 h-8 text-blue-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              {isLoading ? "Processing Document..." : "Upload your document"}
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Drag & drop your PDF, TXT, or CSV here, or click to browse.
            </p>
          </div>

          {!isLoading && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Select File
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-8 grid grid-cols-3 gap-4 text-slate-500 text-xs text-center">
        <div className="flex flex-col items-center gap-2">
           <div className="p-2 bg-slate-800 rounded">PDF</div>
           <span>Reports</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <div className="p-2 bg-slate-800 rounded">TXT</div>
           <span>Notes</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <div className="p-2 bg-slate-800 rounded">CSV</div>
           <span>Data</span>
        </div>
      </div>
    </div>
  );
};
