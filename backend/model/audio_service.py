import asyncio
import websockets
import json
import time

# Simulated speech detection (replace with your Python audio model)
async def detect_speech(websocket, path):
    print("Client connected")
    try:
        while True:
            # Simulate speech start
            await websocket.send(json.dumps({"event": "speech_start"}))
            print("Sent speech_start")
            # Simulate speech duration
            await asyncio.sleep(1.5)
            # Simulate speech end
            await websocket.send(json.dumps({"event": "speech_end"}))
            print("Sent speech_end")
            # Wait before next simulation
            await asyncio.sleep(2.5)
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

# Start WebSocket server
async def main():
    server = await websockets.serve(detect_speech, "localhost", 8000)
    print("WebSocket server running on ws://localhost:8000")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())