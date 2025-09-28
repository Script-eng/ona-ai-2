let listeners = {
  onSpeechStart: () => {},
  onSpeechEnd: () => {},
};

let ws = null;
let reconnectInterval;

export function initAudio() {
  const { API_BASE_URL, WS_LISTEN_PATH } = window.config || { API_BASE_URL: 'http://localhost:8000', WS_LISTEN_PATH: '/listen' };
  ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}${WS_LISTEN_PATH}`);

  ws.onopen = () => {
    console.log("WebSocket connection established");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.event === "speech_start") {
      listeners.onSpeechStart();
    } else if (data.event === "speech_end") {
      listeners.onSpeechEnd();
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket closed, reconnecting...");
    clearInterval(reconnectInterval);
    reconnectInterval = setInterval(initAudio, 5000);
  };
}

export function onSpeechStart(cb) {
  listeners.onSpeechStart = cb;
}

export function onSpeechEnd(cb) {
  listeners.onSpeechEnd = cb;
}

export function cleanupAudio() {
  if (ws) {
    ws.close();
    ws = null;
  }
  clearInterval(reconnectInterval);
}
