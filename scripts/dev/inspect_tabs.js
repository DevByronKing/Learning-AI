const fs = require('fs');

const app = fs.readFileSync('src/components/AprovaLensApp.tsx', 'utf8');
const matches = app.match(/activeTab === '([^']+)'/g) || [];
const tabs = Array.from(new Set(matches.map(m => m.split("'")[1])));
console.log('Tabs renderizadas em AprovaLensApp:', tabs);

const navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
const navMatches = navbar.match(/id:\s*'([^']+)'/g) || [];
console.log('Itens de navegação encontrados na Navbar:', navMatches.slice(0, 20));
