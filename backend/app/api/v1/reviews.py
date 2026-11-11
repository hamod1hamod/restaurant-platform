from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import Review, AdminUser
from app.schemas.schemas import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("", response_model=List[ReviewResponse])
def get_approved_reviews(db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.is_approved == True).order_by(desc(Review.created_at)).limit(20).all()

@router.post("", response_model=ReviewResponse)
def submit_review(review_in: ReviewCreate, db: Session = Depends(get_db)):
    review = Review(
        customer_name=review_in.customer_name,
        rating=review_in.rating,
        comment=review_in.comment,
        is_approved=True # Auto-approve for demo, can be moderated
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.get("/admin", response_model=List[ReviewResponse])
def get_all_reviews_admin(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Review).order_by(desc(Review.created_at)).all()

@router.patch("/{review_id}/approve")
def toggle_review_approval(
    review_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_approved = not review.is_approved
    db.commit()
    return {"id": review.id, "is_approved": review.is_approved}

@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}
