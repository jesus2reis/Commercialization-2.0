const fs = require('fs');
let code = fs.readFileSync('components/GuidedCountryView.tsx', 'utf8');

code = code.replace(
  /\{\/\* Determine layout wrapper based on view \*\/}\s*<div/g,
  '<div'
);

fs.writeFileSync('components/GuidedCountryView.tsx', code);
