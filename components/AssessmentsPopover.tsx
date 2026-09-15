import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { AssessmentItem } from '../types';
import { groupAssessments } from '../services/assessmentEngine';

interface AssessmentsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  actions: (AssessmentItem | string)[];
}

export const AssessmentsPopover: React.FC<AssessmentsPopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
  actions,
}) => {
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 320;
    const margin = 8;

    // Check vertical space (flip to top if near bottom)
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < 280 && rect.top > 280;

    let left = rect.left;
    // Keep popover within horizontal screen boundaries
    if (left + popoverWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - popoverWidth - 16);
    } else {
      left = Math.max(16, left);
    }

    if (openUpwards) {
      setCoords({
        bottom: window.innerHeight - rect.top + margin,
        left,
      });
    } else {
      setCoords({
        top: rect.bottom + margin,
        left,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const { mustHaveItems, niceToHaveItems, flatItems, totalCount } = groupAssessments(actions);
  const hasRequirementsGrouping = mustHaveItems.length > 0 || niceToHaveItems.length > 0;

  if (!isOpen || totalCount === 0 || !coords) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Invisible backdrop to capture click-outside */}
      <div 
        className="fixed inset-0 bg-black/10 transition-opacity animate-in fade-in duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Popover container */}
      <div
        ref={popoverRef}
        onClick={(e) => e.stopPropagation()}
        className="fixed z-[101] w-80 max-w-[calc(100vw-32px)] bg-white border border-slate-200/90 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        style={{
          top: coords.top !== undefined ? `${coords.top}px` : undefined,
          bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
          left: `${coords.left}px`,
        }}
      >
        {/* Popover Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <h6 className="text-xs font-bold text-slate-900 tracking-tight">
              Required Assessments ({totalCount})
            </h6>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Popover Content */}
        <div className="max-h-64 overflow-y-auto space-y-1.5 p-2.5 text-left">
          {hasRequirementsGrouping ? (
            <>
              {/* MUST-HAVE SECTION */}
              {mustHaveItems.length > 0 && (
                <div>
                  <div className="mb-1">
                    <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase px-1">
                      Must-have ({mustHaveItems.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {mustHaveItems.map((item, idx) => (
                      <div 
                        key={`must-${idx}`} 
                        className="flex items-start gap-2 px-1.5 py-1 rounded-lg hover:bg-slate-50/80 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span className="text-xs text-neutral-700 leading-snug">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEPARATOR */}
              {mustHaveItems.length > 0 && niceToHaveItems.length > 0 && (
                <hr className="my-2 border-neutral-100" />
              )}

              {/* NICE-TO-HAVE SECTION */}
              {niceToHaveItems.length > 0 && (
                <div>
                  <div className="mb-1">
                    <span className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase px-1">
                      Nice-to-have ({niceToHaveItems.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {niceToHaveItems.map((item, idx) => (
                      <div 
                        key={`nice-${idx}`} 
                        className="flex items-start gap-2 px-1.5 py-1 rounded-lg hover:bg-slate-50/80 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                        <span className="text-xs text-neutral-700 leading-snug">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FLAT ITEMS (IF ANY REMAIN IN MIXED PILLARS) */}
              {flatItems.length > 0 && (
                <>
                  {(mustHaveItems.length > 0 || niceToHaveItems.length > 0) && (
                    <hr className="my-2 border-neutral-100" />
                  )}
                  <div className="space-y-1">
                    {flatItems.map((item, idx) => (
                      <div 
                        key={`flat-${idx}`} 
                        className="flex items-start gap-2 px-1.5 py-1 rounded-lg hover:bg-slate-50/80 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span className="text-xs text-neutral-700 leading-snug">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            /* FALLBACK FOR OTHER PILLARS WITHOUT REQUIREMENTS DIVISION */
            <div className="space-y-1">
              {flatItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2 px-1.5 py-1 rounded-lg hover:bg-slate-50/80 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-xs text-neutral-700 leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
