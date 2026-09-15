import React, { useState, useRef } from 'react';
import { AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';
import { AssessmentsPopover } from './AssessmentsPopover';
import { AssessmentItem } from '../types';

interface RangeActionFooterProps {
  actionList: (AssessmentItem | string)[];
  notesCount: number;
  onOpenNotes: () => void;
}

export const RangeActionFooter: React.FC<RangeActionFooterProps> = ({
  actionList,
  notesCount,
  onOpenNotes,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasActions = actionList.length > 0;

  return (
    <div 
      className={`border rounded-xl p-4 flex flex-row items-center justify-between gap-4 ${
        hasActions ? 'bg-white border-amber-200 shadow-sm' : 'bg-white/50 border-slate-200'
      }`}
    >
      {hasActions ? (
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <h5 className="text-sm font-bold text-slate-900 mb-0.5">
              {actionList.length === 1 ? '1 Assessment Needed' : `${actionList.length} Assessments Needed`}
            </h5>
            <button
              ref={triggerRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPopoverOpen(prev => !prev);
              }}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer"
            >
              View details
            </button>
          </div>
          <AssessmentsPopover
            isOpen={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
            triggerRef={triggerRef}
            actions={actionList}
          />
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-slate-400 shrink-0 mt-0.5" size={18} />
          <div>
            <h5 className="text-sm font-bold text-slate-600 mb-0.5">No Action Needed</h5>
            <p className="text-xs text-slate-500">Requirements are fulfilled for this range.</p>
          </div>
        </div>
      )}

      <button 
        type="button"
        onClick={(e) => { 
          e.stopPropagation(); 
          onOpenNotes();
        }}
        className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
          notesCount > 0
            ? 'bg-[#071b45]/10 border-[#071b45]/30 text-[#071b45] hover:bg-[#071b45]/20 hover:border-[#071b45]/50 cursor-pointer'
            : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 cursor-pointer'
        }`}
      >
        <MessageSquare size={14} className={notesCount > 0 ? "fill-current" : ""} />
        Notes {notesCount > 0 && (
          <span className="bg-[#071b45] text-white font-semibold text-[11px] px-2 py-0.5 rounded-full shadow-sm">
            {notesCount}
          </span>
        )}
      </button>
    </div>
  );
};
