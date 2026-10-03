from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from langchain_community.chat_models import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
import os

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    file_path: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set or invalid in .env")

    try:
        # We use a relatively simple model for the MVP
        llm = ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo", api_key=api_key)
        
        system_prompt = "You are DevPilot AI, an intelligent coding assistant. Help the user with their coding tasks."
        if request.context:
            system_prompt += f"\n\nCurrent file context ({request.file_path or 'unknown'}):\n```\n{request.context}\n```"

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=request.message)
        ]
        
        response = llm.invoke(messages)
        return ChatResponse(reply=response.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
