import React from 'react';

export const FmcIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 85" 
      fill="currentColor" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Shape */}
      <path d="M0 0 L100 0 L50 28 Z" fill="#004987" />
      {/* Middle Shape */}
      <path d="M15 34 L85 34 L50 62 Z" fill="#004987" />
      {/* Bottom Shape */}
      <path d="M35 68 L65 68 L50 80 Z" fill="#004987" />
    </svg>
  );
};

export const FmcFullLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <FmcIcon className="w-16 h-16 md:w-20 md:h-20 shrink-0" />
      <div className="flex flex-col items-start justify-center text-[#004987]">
        <span className="font-black text-3xl md:text-4xl leading-none tracking-tight uppercase">
          Fresenius
        </span>
        <span className="font-bold text-3xl md:text-4xl leading-none tracking-tight uppercase">
          Medical Care
        </span>
      </div>
    </div>
  );
};