from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import RestaurantSettings, AdminUser, AuditLog
from app.schemas.schemas import SettingsUpdate, SettingsResponse

router = APIRouter(prefix="/settings", tags=["Restaurant Settings"])

@router.get("", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(RestaurantSettings).first()
    if not settings:
        settings = RestaurantSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("", response_model=SettingsResponse)
def update_settings(
    settings_in: SettingsUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    settings = db.query(RestaurantSettings).first()
    if not settings:
        settings = RestaurantSettings(id=1)
        db.add(settings)
        
    for field, value in settings_in.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
        
    db.commit()
    db.refresh(settings)
    
    audit = AuditLog(
        admin_id=current_admin.id,
        admin_username=current_admin.username,
        action="UPDATE",
        entity="Settings",
        entity_id="1",
        details="Updated restaurant branding and landing page settings"
    )
    db.add(audit)
    db.commit()
    
    return settings
