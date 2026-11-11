import shutil
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.core.config import settings
from app.core.security import get_current_admin
from app.models.models import AdminUser

router = APIRouter(prefix="/uploads", tags=["Uploads"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".svg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    current_admin: AdminUser = Depends(get_current_admin)
):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File extension {ext} not allowed. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )
        
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    destination_path = settings.UPLOAD_DIR / unique_filename
    
    with open(destination_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_url = f"{settings.STATIC_URL_PREFIX}/{unique_filename}"
    return {
        "url": file_url,
        "filename": unique_filename,
        "original_name": file.filename
    }
