from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

# Allow CORS for Angular application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# List to hold connected WebSocket clients
clients: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            # Broadcast message to all connected clients
            for client in clients:
                if client != websocket:  # Don't send back to the sender
                    await client.send_text(message)
    except WebSocketDisconnect:
        clients.remove(websocket)
