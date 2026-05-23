import { spawn } from 'child_process';
import { execSync } from 'child_process';
import fs from 'fs';

let chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(chromePath)) {
  chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
}
if (!fs.existsSync(chromePath)) {
  try {
    const regQuery = execSync('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve').toString();
    const match = regQuery.match(/REG_SZ\s+(.+)/);
    if (match && match[1]) {
      chromePath = match[1].trim();
    }
  } catch (e) {
    console.log("Could not find chrome path via registry, using default.");
  }
}

console.log("Using Chrome Path:", chromePath);

// Start chrome headless
const chromeProcess = spawn(chromePath, [
  '--headless',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-sandbox'
]);

chromeProcess.on('error', (err) => {
  console.error("Failed to start Chrome process:", err);
});

// Wait for chrome to boot
setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await res.json();

    const target = targets.find(t => t.type === 'page');

    if (!target) {
      console.log("No page targets found. Exiting.");
      chromeProcess.kill();
      process.exit(1);
    }

    const wsUrl = target.webSocketDebuggerUrl;
    console.log("Connecting to Page Target WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));

      console.log("Navigating to http://localhost:5173...");
      ws.send(JSON.stringify({
        id: 5,
        method: 'Page.navigate',
        params: { url: 'http://localhost:5173' }
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      // Modern console API logs (console.log, console.error)
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        console.log(`[CONSOLE ${msg.params.type.toUpperCase()}]: ${args}`);
      }

      // Modern browser engine logs (CORS, failed script loads)
      if (msg.method === 'Log.entryAdded') {
        const entry = msg.params.entry;
        console.warn(`[BROWSER LOG ${entry.level.toUpperCase()}]: ${entry.text} at ${entry.url}`);
      }

      // Runtime exception
      if (msg.method === 'Runtime.exceptionThrown') {
        const details = msg.params.exceptionDetails;
        console.error(`[EXCEPTION]: ${details.exception.description || details.text} at line ${details.lineNumber}`);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // Close after 6 seconds
    setTimeout(() => {
      ws.close();
      chromeProcess.kill();
      process.exit(0);
    }, 6000);

  } catch (err) {
    console.error("Error during debugging connection:", err);
    chromeProcess.kill();
    process.exit(1);
  }
}, 2000);
