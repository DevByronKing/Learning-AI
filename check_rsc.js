const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    const regex = /self\.__next_f\.push\(\[1,"(.*?)"\]\)/gs;
    let match;
    while ((match = regex.exec(data)) !== null) {
      console.log('--- NEXT_F CHUNK ---');
      console.log(match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'));
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
