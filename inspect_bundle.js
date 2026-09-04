const http = require('http');

http.get('http://localhost:3000/_next/static/chunks/app/page.js', (res) => {
  let d = '';
  res.on('data', (c) => d += c);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode, 'LENGTH:', d.length);
    let idx = -1;
    while ((idx = d.indexOf('AprovaLensApp.tsx', idx + 1)) !== -1) {
      console.log('OCCURRENCE AT', idx, ':', JSON.stringify(d.slice(Math.max(0, idx - 60), idx + 60)));
    }
  });
}).on('error', (e) => console.error(e));
