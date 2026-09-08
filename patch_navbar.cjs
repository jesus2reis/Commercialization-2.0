const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

code = code.replace(
  /<span className="font-black text-base sm:text-xl text-\[#0033a0\] leading-none tracking-tight shrink-0">/,
  '<button onClick={() => setSelectedMarketId(null)} className="font-black text-base sm:text-xl text-[#0033a0] leading-none tracking-tight shrink-0 hover:opacity-80 transition-opacity text-left cursor-pointer">'
);
code = code.replace(
  /FME Commercialization 2\.0\s*<\/span>/,
  'FME Commercialization 2.0\n            </button>'
);

fs.writeFileSync('components/Navbar.tsx', code);
