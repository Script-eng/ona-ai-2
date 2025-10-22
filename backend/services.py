# services.py

import os
import io
import base64
from typing import Tuple, Dict

import PyPDF2
from gtts import gTTS
from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()

# --- Configuration ---
LLM_MODEL = "llama-3.1-8b-instant"
api_key = os.getenv("GROQ_API_KEY")

# --- Core Service Classes ---

class DocumentProcessor:
    """Handles PDF text extraction."""
    def extract_text_from_pdf(self, pdf_file: io.BytesIO) -> Tuple[str, Dict]:
        """Extracts text and metadata from an in-memory PDF file."""
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = "".join(page.extract_text() for page in pdf_reader.pages)
            metadata = {"page_count": len(pdf_reader.pages)}
            
            if not text.strip():
                return "", {"error": "Could not extract text from the PDF."}
            
            return text.strip(), metadata
        except Exception as e:
            return "", {"error": f"Failed to read PDF: {str(e)}"}

class LLMHandler:
    """Manages LLM interactions for summarization."""
    def __init__(self, model_name: str, api_key: str):
        if not api_key:
            raise ValueError("API key is missing. Cannot initialize LLMHandler.")
        self.llm = ChatGroq(model_name=model_name, temperature=0.7, groq_api_key=api_key)

    def generate_summary(self, text: str) -> str:
        """Generates a summary for the given text."""
        # Use a smaller preview for the prompt to be efficient
        text_preview = text[:4000] if len(text) > 4000 else text
        prompt = f"Provide a concise, easy-to-understand summary of the following document in about 2-3 paragraphs:\n\n{text_preview}\n\nSummary:"
        
        try:
            response = self.llm.invoke(prompt)
            return response.content.strip()
        except Exception as e:
            # In an API, it's better to return an error message than to fail silently
            return f"Error: Summary generation failed. Details: {str(e)}"

def generate_audio_base64(text: str) -> str:
    """Generates TTS audio and returns it as a Base64 encoded string."""
    try:
        tts = gTTS(text=text, lang="en")
        audio_fp = io.BytesIO()
        tts.write_to_fp(audio_fp)
        audio_fp.seek(0)
        
        # Encode the audio bytes to Base64
        base64_audio = base64.b64encode(audio_fp.read()).decode('utf-8')
        
        # Format as a Data URI, which is easy for browsers to handle
        return f"data:audio/mp3;base64,{base64_audio}"
    except Exception as e:
        return f"Error: Audio generation failed. Details: {str(e)}"

# --- Main Service Orchestrator ---

def process_summarization_request(file: io.BytesIO) -> Dict:
    """Orchestrates the entire summarization process."""
    if not api_key:
        return {"error": "Server is missing the GROQ_API_KEY."}

    # 1. Initialize services
    doc_processor = DocumentProcessor()
    llm_handler = LLMHandler(LLM_MODEL, api_key)

    # 2. Extract text from the uploaded PDF
    text, metadata = doc_processor.extract_text_from_pdf(file)
    if "error" in metadata:
        return {"error": metadata["error"]}

    # 3. Generate the summary
    summary_text = llm_handler.generate_summary(text)
    if summary_text.startswith("Error:"):
        return {"error": summary_text}

    # 4. Generate the audio for the summary
    audio_content = generate_audio_base64(summary_text)
    if audio_content.startswith("Error:"):
        return {"error": audio_content}
        
    # 5. Return the successful result
    return {
        "summary_text": summary_text,
        "audio_content": audio_content,
        "metadata": metadata
    }