const fs = require('fs');
let code = fs.readFileSync('components/CountrySelector.tsx', 'utf8');

code = code.replace(
  /<div className="flex items-center gap-3">/g,
  '<div className="flex items-center gap-3 w-full min-w-0">'
);
code = code.replace(
  /<div>\s*<span className="font-bold text-slate-900 block group-hover:text-\[#0033a0\]">\{market.country\}<\/span>\s*<span className="text-xs text-slate-500">\{market.region\}<\/span>\s*<\/div>/g,
  '<div className="min-w-0 text-left flex-1"><span className="font-bold text-slate-900 block truncate group-hover:text-[#0033a0]">{market.country}</span><span className="text-xs text-slate-500 block truncate">{market.region}</span></div>'
);

fs.writeFileSync('components/CountrySelector.tsx', code);
