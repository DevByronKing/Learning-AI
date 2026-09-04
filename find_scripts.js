const http = require('http');

http.get('http://localhost:3000', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const scripts = [];
    const regex = /<script[^>]+src="([^">]+)"/g;
    let m;
    while ((m = regex.exec(d)) !== null) {
      scripts.push(m[1]);
    }
    console.log('SCRIPTS IN HTML:', scripts);
  });
});
