async function check() {
  const urls = [
    'http://localhost:5173/',
    'http://localhost:5173/src/main.jsx',
    'http://localhost:5173/src/index.css',
    'http://localhost:5173/src/App.jsx'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.status} ${res.statusText}`);
      console.log(`Content-Type: ${res.headers.get('content-type')}`);
      const text = await res.text();
      console.log(`Snippet: ${text.slice(0, 150).replace(/\r?\n/g, ' ')}...`);
      console.log('--------------------------------------------------');
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err.message);
    }
  }
}

check();
