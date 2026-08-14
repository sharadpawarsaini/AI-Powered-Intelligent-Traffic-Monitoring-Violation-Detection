from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import AssistantQueryRequest, AssistantQueryResponse
from app.services.rag_service import rag_service
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/assistant", tags=["GenAI Traffic Assistant"])

@router.post("/query", response_model=AssistantQueryResponse)
async def query_traffic_assistant(
    request: AssistantQueryRequest,
    current_user=Depends(get_current_user)
):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query text cannot be empty")

    response = await rag_service.answer_query(request.query)
    return response
