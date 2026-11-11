from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_admin
from app.core.config import settings
from app.models.models import AdminUser
from app.schemas.schemas import Token, LoginRequest, AdminCreate, AdminResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(
        (AdminUser.username == request.username) | (AdminUser.email == request.username)
    ).first()
    
    if not admin or not verify_password(request.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username, "role": admin.role, "id": admin.id},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": admin.id,
            "username": admin.username,
            "email": admin.email,
            "full_name": admin.full_name,
            "role": admin.role
        }
    }

@router.get("/me", response_model=AdminResponse)
def get_me(current_admin: AdminUser = Depends(get_current_admin)):
    return current_admin

@router.post("/register", response_model=AdminResponse)
def register(user_in: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(AdminUser).filter(
        (AdminUser.username == user_in.username) | (AdminUser.email == user_in.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    admin = AdminUser(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "admin"
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin
