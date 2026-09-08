import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { FileText, RefreshCw } from 'lucide-react';
import { FmcFullLogo } from './FmcLogo';

interface NavbarProps {
  onRandomize: () => void;
  onOpenPdfModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRandomize,
  onOpenPdfModal
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="w-full max-w-[1780px] mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-6">
            <FmcFullLogo className="h-10" />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl text-[#071b45] leading-none tracking-tight">
                COMMERCIALIZATION 2.0
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onRandomize}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Randomize Data</span>
            </button>
            <button
              onClick={onOpenPdfModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#0033a0] text-white rounded-xl hover:bg-[#071b45] transition-all shadow-xs cursor-pointer"
            >
              <FileText size={15} />
              <span>Export Summary PDF</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
