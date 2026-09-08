const fs = require('fs');
let code = fs.readFileSync('components/GuidedCountryView.tsx', 'utf8');

// Replace the main wrapper div padding and add flex col
code = code.replace(
  /<div className="w-full max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">/,
  `{/* Determine layout wrapper based on view */}
    <div className={\`w-full mx-auto px-4 animate-in fade-in duration-500 flex flex-col \${selectedMarket && !selectedPillarId ? 'max-w-7xl h-[calc(100vh-4rem)] py-6' : 'max-w-5xl py-12'}\`}>`
);

// Modify the Bento Grid wrapper
code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">/,
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-in fade-in duration-300 flex-1 min-h-0">'
);

// Modify the pillar buttons in the Bento Grid to take full height
code = code.replace(
  /className="flex flex-col text-left bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-\[#0033a0\]\/40 hover:-translate-y-1 transition-all overflow-hidden group"/g,
  'className="flex flex-col text-left bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#0033a0]/40 hover:-translate-y-1 transition-all overflow-hidden group h-full"'
);

// Modify internal padding of the cards so they flex nicely
code = code.replace(
  /<div className={`p-5 border-b border-slate-100 flex flex-col gap-2 \${pillar.badgeBg} transition-colors group-hover:bg-opacity-80`}>/g,
  '<div className={`p-4 xl:p-5 border-b border-slate-100 flex flex-col gap-2 ${pillar.badgeBg} transition-colors group-hover:bg-opacity-80 shrink-0`}>'
);
code = code.replace(
  /<div className="p-5 flex-1 flex flex-col justify-between gap-6">/g,
  '<div className="p-4 xl:p-5 flex-1 flex flex-col justify-between gap-4">'
);

fs.writeFileSync('components/GuidedCountryView.tsx', code);
