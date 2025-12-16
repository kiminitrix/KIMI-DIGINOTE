import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    <p className="text-slate-400 text-sm animate-pulse">Analyzing document & generating slides...</p>
  </div>
);
