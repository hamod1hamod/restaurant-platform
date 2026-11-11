from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import Product, ProductSize, ProductExtra, ProductImage, AdminUser, AuditLog
from app.schemas.schemas import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    product_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_vegetarian: Optional[bool] = None,
    is_spicy: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    is_bestseller: Optional[bool] = None,
    is_new: Optional[bool] = None,
    is_available: Optional[bool] = None,
    sort_by: Optional[str] = "order", # order, price_asc, price_desc, newest, popular
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_fmt),
                Product.name_ar.ilike(search_fmt),
                Product.description.ilike(search_fmt),
                Product.description_ar.ilike(search_fmt),
                Product.ingredients.ilike(search_fmt)
            )
        )
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
        
    if product_type:
        query = query.filter(Product.product_type == product_type)
        
    if min_price is not None:
        query = query.filter(Product.base_price >= min_price)
        
    if max_price is not None:
        query = query.filter(Product.base_price <= max_price)
        
    if is_vegetarian is not None:
        query = query.filter(Product.is_vegetarian == is_vegetarian)
        
    if is_spicy is not None:
        query = query.filter(Product.is_spicy == is_spicy)
        
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
        
    if is_bestseller is not None:
        query = query.filter(Product.is_bestseller == is_bestseller)
        
    if is_new is not None:
        query = query.filter(Product.is_new == is_new)
        
    if is_available is not None:
        query = query.filter(Product.is_available == is_available)
        
    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(asc(Product.base_price))
    elif sort_by == "price_desc":
        query = query.order_by(desc(Product.base_price))
    elif sort_by == "newest":
        query = query.order_by(desc(Product.created_at))
    elif sort_by == "popular":
        query = query.order_by(desc(Product.is_bestseller), desc(Product.is_featured))
    else:
        query = query.order_by(asc(Product.display_order), desc(Product.id))
        
    return query.all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ProductResponse)
def create_product(
    prod_in: ProductCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    prod_data = prod_in.model_dump(exclude={"sizes", "extras", "images"})
    product = Product(**prod_data)
    db.add(product)
    db.flush() # get product.id
    
    # Add sizes
    for s in prod_in.sizes:
        size = ProductSize(
            product_id=product.id,
            name=s.name,
            name_ar=s.name_ar,
            price=s.price,
            is_default=s.is_default
        )
        db.add(size)
        
    # Add extras
    for e in prod_in.extras:
        extra = ProductExtra(
            product_id=product.id,
            name=e.name,
            name_ar=e.name_ar,
            price=e.price,
            max_quantity=e.max_quantity,
            is_available=e.is_available
        )
        db.add(extra)
        
    # Add images
    for img in prod_in.images:
        image = ProductImage(
            product_id=product.id,
            image_url=img.image_url,
            is_primary=img.is_primary,
            display_order=img.display_order
        )
        db.add(image)

    db.commit()
    db.refresh(product)
    
    audit = AuditLog(
        admin_id=current_admin.id,
        admin_username=current_admin.username,
        action="CREATE",
        entity="Product",
        entity_id=str(product.id),
        details=f"Created product {product.name}"
    )
    db.add(audit)
    db.commit()
    
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    prod_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    update_data = prod_in.model_dump(exclude_unset=True, exclude={"sizes", "extras", "images"})
    for field, value in update_data.items():
        setattr(product, field, value)
        
    # Replace sizes if provided
    if prod_in.sizes is not None:
        db.query(ProductSize).filter(ProductSize.product_id == product.id).delete()
        for s in prod_in.sizes:
            db.add(ProductSize(
                product_id=product.id,
                name=s.name,
                name_ar=s.name_ar,
                price=s.price,
                is_default=s.is_default
            ))
            
    # Replace extras if provided
    if prod_in.extras is not None:
        db.query(ProductExtra).filter(ProductExtra.product_id == product.id).delete()
        for e in prod_in.extras:
            db.add(ProductExtra(
                product_id=product.id,
                name=e.name,
                name_ar=e.name_ar,
                price=e.price,
                max_quantity=e.max_quantity,
                is_available=e.is_available
            ))
            
    # Replace images if provided
    if prod_in.images is not None:
        db.query(ProductImage).filter(ProductImage.product_id == product.id).delete()
        for img in prod_in.images:
            db.add(ProductImage(
                product_id=product.id,
                image_url=img.image_url,
                is_primary=img.is_primary,
                display_order=img.display_order
            ))
            
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    db.delete(product)
    db.commit()
    
    audit = AuditLog(
        admin_id=current_admin.id,
        admin_username=current_admin.username,
        action="DELETE",
        entity="Product",
        entity_id=str(product_id),
        details=f"Deleted product #{product_id}"
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Product deleted successfully"}

@router.post("/{product_id}/duplicate", response_model=ProductResponse)
def duplicate_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    original = db.query(Product).filter(Product.id == product_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Product not found")
        
    new_product = Product(
        category_id=original.category_id,
        name=f"{original.name} (Copy)",
        name_ar=f"{original.name_ar} (نسخة)",
        description=original.description,
        description_ar=original.description_ar,
        product_type=original.product_type,
        base_price=original.base_price,
        discount_price=original.discount_price,
        image_url=original.image_url,
        is_available=original.is_available,
        is_featured=False,
        is_bestseller=False,
        is_new=True,
        is_vegetarian=original.is_vegetarian,
        is_spicy=original.is_spicy,
        ingredients=original.ingredients,
        ingredients_ar=original.ingredients_ar,
        calories=original.calories,
        prep_time_mins=original.prep_time_mins,
        display_order=original.display_order + 1
    )
    db.add(new_product)
    db.flush()
    
    for s in original.sizes:
        db.add(ProductSize(
            product_id=new_product.id,
            name=s.name,
            name_ar=s.name_ar,
            price=s.price,
            is_default=s.is_default
        ))
        
    for e in original.extras:
        db.add(ProductExtra(
            product_id=new_product.id,
            name=e.name,
            name_ar=e.name_ar,
            price=e.price,
            max_quantity=e.max_quantity,
            is_available=e.is_available
        ))
        
    db.commit()
    db.refresh(new_product)
    return new_product

@router.patch("/{product_id}/toggle-availability")
def toggle_availability(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    product.is_available = not product.is_available
    db.commit()
    db.refresh(product)
    return {"id": product.id, "is_available": product.is_available}
