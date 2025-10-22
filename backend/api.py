# api.py
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services import process_summarization_request

# Initialize the FastAPI app
app = FastAPI(
    title="Ona AI Summarization API",
    description="An API that takes a PDF, summarizes it, and returns text-to-speech audio.",
    version="1.0.0"
)

# --- Middleware ---
# This is crucial for allowing your frontend to communicate with this backend.
# It allows requests from any origin (*). For production, you might restrict this
# to your actual frontend's domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.get("/", tags=["Root"])
def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the Ona AI Summarization API. Use the /docs endpoint to see the documentation."}
@app.post("/summarize")
@app.post("/summarize/", tags=["Summarization"])
async def summarize_document(file: UploadFile = File(...)):
    """
    Accepts a PDF file, summarizes its content, and returns the summary
    along with a Base64-encoded audio version of the summary.
    """
    # Check if the uploaded file is a PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    # Read the file content into an in-memory buffer
    file_content = await file.read()
    pdf_buffer = io.BytesIO(file_content)
    
    # Process the request using our service logic
    result = process_summarization_request(pdf_buffer)
    
    # Handle potential errors from the service
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result