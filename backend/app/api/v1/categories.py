from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import Category, Product, AdminUser, AuditLog
from app.schemas.schemas import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(
    include_inactive: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Category)
    if not include_inactive:
        query = query.filter(Category.is_active == True)
    
    categories = query.order_by(Category.display_order.asc(), Category.name.asc()).all()
    
    # Calculate product count for each category
    result = []
    for cat in categories:
        p_count = db.query(func.count(Product.id)).filter(Product.category_id == cat.id).scalar() or 0
        cat_dict = {
            "id": cat.id,
            "name": cat.name,
            "name_ar": cat.name_ar,
            "description": cat.description,
            "description_ar": cat.description_ar,
            "image_url": cat.image_url,
            "icon": cat.icon or "Utensils",
            "display_order": cat.display_order,
            "is_active": cat.is_active,
            "parent_id": cat.parent_id,
            "product_count": p_count,
            "subcategories": []
        }
        result.append(cat_dict)
    return result

@router.post("", response_model=CategoryResponse)
def create_category(
    cat_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    category = Category(**cat_in.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    
    # Audit log
    audit = AuditLog(
        admin_id=current_admin.id,
        admin_username=current_admin.username,
        action="CREATE",
        entity="Category",
        entity_id=str(category.id),
        details=f"Created category {category.name}"
    )
    db.add(audit)
    db.commit()
    
    return {**category.__dict__, "product_count": 0, "subcategories": []}

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    cat_in: CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    for field, value in cat_in.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
        
    db.commit()
    db.refresh(category)
    
    p_count = db.query(func.count(Product.id)).filter(Product.category_id == category.id).scalar() or 0
    return {**category.__dict__, "product_count": p_count, "subcategories": []}

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    db.delete(category)
    db.commit()
    
    audit = AuditLog(
        admin_id=current_admin.id,
        admin_username=current_admin.username,
        action="DELETE",
        entity="Category",
        entity_id=str(category_id),
        details=f"Deleted category #{category_id}"
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Category deleted successfully"}
