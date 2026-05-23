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
      
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        console.log(`[CONSOLE ${msg.params.type.toUpperCase()}]: ${args}`);
      }

      if (msg.method === 'Log.entryAdded') {
        const entry = msg.params.entry;
        console.warn(`[BROWSER LOG ${entry.level.toUpperCase()}]: ${entry.text} at ${entry.url}`);
      }

      if (msg.method === 'Runtime.exceptionThrown') {
        const details = msg.params.exceptionDetails;
        console.error(`[EXCEPTION]: ${details.exception.description || details.text} at line ${details.lineNumber}`);
      }

      if (msg.id === 30) {
        console.log("=== Click Evaluation Result ===");
        console.log(msg.result);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // Scroll and Click after 3 seconds
    setTimeout(() => {
      console.log("Scrolling and clicking Reiniciar inside SplitText...");
      const expr = `(() => {
        const el = document.getElementById('split-text');
        if (!el) return 'Element #split-text not found';
        el.scrollIntoView();
        const btn = Array.from(el.querySelectorAll('button')).find(b => b.textContent.includes('Reiniciar'));
        if (!btn) return 'Button not found';
        btn.click();
        return 'Clicked button successfully!';
      })()`;
      ws.send(JSON.stringify({
        id: 30,
        method: 'Runtime.evaluate',
        params: { expression: expr }
      }));
    }, 3000);

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
