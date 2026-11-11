from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import Coupon, AdminUser
from app.schemas.schemas import CouponCreate, CouponResponse, CouponValidateRequest, CouponValidateResponse

router = APIRouter(prefix="/coupons", tags=["Coupons"])

@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon(
    req: CouponValidateRequest,
    db: Session = Depends(get_db)
):
    coupon = db.query(Coupon).filter(
        Coupon.code == req.code.strip().upper(),
        Coupon.is_active == True
    ).first()
    
    if not coupon:
        return CouponValidateResponse(valid=False, message="Invalid promo coupon code")
        
    if coupon.valid_until and coupon.valid_until < datetime.now(timezone.utc):
        return CouponValidateResponse(valid=False, message="This coupon has expired")
        
    if req.subtotal < coupon.min_order_value:
        return CouponValidateResponse(
            valid=False,
            message=f"Minimum order value for this coupon is {coupon.min_order_value:.2f}"
        )
        
    discount = 0.0
    if coupon.discount_percent:
        discount = (req.subtotal * coupon.discount_percent) / 100.0
    elif coupon.discount_amount:
        discount = coupon.discount_amount
        
    if coupon.max_discount and discount > coupon.max_discount:
        discount = coupon.max_discount
        
    return CouponValidateResponse(
        valid=True,
        message="Coupon applied successfully!",
        discount_amount=round(discount, 2),
        code=coupon.code
    )

@router.get("", response_model=List[CouponResponse])
def get_coupons(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Coupon).all()

@router.post("", response_model=CouponResponse)
def create_coupon(
    coupon_in: CouponCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    code = coupon_in.code.strip().upper()
    existing = db.query(Coupon).filter(Coupon.code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")
        
    coupon_data = coupon_in.model_dump()
    coupon_data["code"] = code
    coupon = Coupon(**coupon_data)
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon

@router.delete("/{coupon_id}")
def delete_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    db.delete(coupon)
    db.commit()
    return {"message": "Coupon deleted successfully"}
