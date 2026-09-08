const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  /<main className="flex-1 pb-16">/,
  '<main className="flex-1 flex flex-col">'
);

fs.writeFileSync('App.tsx', code);
