from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
import uvicorn
from model.audio_service import detect_speech  # Import from your team's models

app = FastAPI(title="ONA-AI Backend")

@app.get("/health")
async def health_check():
    return JSONResponse({"status": "healthy"})

@app.websocket("/listen")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await detect_speech(websocket)  # Your team's audio logic here

# Your team adds more endpoints here, e.g.:
# @app.post("/api/llama/query")
# async def llama_query(input: dict):
#     return {"response": llama_model.process(input)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)