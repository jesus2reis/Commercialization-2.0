const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

code = code.replace(
  /<div className="hidden sm:block">\s*<CountrySelector/g,
  '<div className="w-full sm:w-auto">\s*<CountrySelector'
);
// Actually, using RegExp or just exact string match is safer. Let's just rewrite Navbar.tsx since it's short.
