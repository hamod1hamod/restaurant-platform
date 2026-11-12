from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.models import Order, OrderItem, OrderItemExtra, Coupon, RestaurantSettings, AdminUser, AuditLog
from app.schemas.schemas import OrderCreate, OrderResponse, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db)
):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")
        
    settings = db.query(RestaurantSettings).first()
    delivery_fee = settings.delivery_fee if (settings and order_in.order_type == "delivery") else 0.0
    
    # Calculate subtotal
    subtotal = 0.0
    for item in order_in.items:
        item_total = item.unit_price * item.quantity
        for extra in item.extras:
            item_total += (extra.extra_price * extra.quantity) * item.quantity
        subtotal += item_total
        
    # Check minimum order value for delivery
    if settings and order_in.order_type == "delivery" and subtotal < settings.min_order_value:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum order value for delivery is {settings.currency} {settings.min_order_value:.2f}"
        )
        
    # Validate and apply coupon if present
    discount_amount = 0.0
    if order_in.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == order_in.coupon_code.strip().upper(),
            Coupon.is_active == True
        ).first()
        if coupon:
            if not coupon.valid_until or coupon.valid_until >= datetime.now(timezone.utc):
                if subtotal >= coupon.min_order_value:
                    if coupon.discount_percent:
                        discount_amount = (subtotal * coupon.discount_percent) / 100.0
                    elif coupon.discount_amount:
                        discount_amount = coupon.discount_amount
                    if coupon.max_discount and discount_amount > coupon.max_discount:
                        discount_amount = coupon.max_discount
                    coupon.usage_count += 1
                    
    total = max(0.0, subtotal + delivery_fee - discount_amount)
    
    # Create order
    order = Order(
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        customer_email=order_in.customer_email,
        delivery_address=order_in.delivery_address,
        order_type=order_in.order_type,
        table_number=order_in.table_number,
        notes=order_in.notes,
        status="new",
        subtotal=round(subtotal, 2),
        delivery_fee=round(delivery_fee, 2),
        discount_amount=round(discount_amount, 2),
        total=round(total, 2),
        payment_method=order_in.payment_method,
        payment_status="paid" if order_in.payment_method in ["card", "online"] else "pending",
        coupon_code=order_in.coupon_code
    )
    db.add(order)
    db.flush()
    
    # Add items
    for itm in order_in.items:
        item_tot = itm.unit_price * itm.quantity
        for ex in itm.extras:
            item_tot += (ex.extra_price * ex.quantity) * itm.quantity
            
        order_item = OrderItem(
            order_id=order.id,
            product_id=itm.product_id,
            product_name=itm.product_name,
            product_name_ar=itm.product_name_ar,
            size_name=itm.size_name,
            unit_price=itm.unit_price,
            quantity=itm.quantity,
            total_price=round(item_tot, 2),
            special_instructions=itm.special_instructions
        )
        db.add(order_item)
        db.flush()
        
        for ex in itm.extras:
            db.add(OrderItemExtra(
                order_item_id=order_item.id,
                extra_name=ex.extra_name,
                extra_price=ex.extra_price,
                quantity=ex.quantity
            ))
            
    db.commit()
    db.refresh(order)
    return order

@router.get("", response_model=List[OrderResponse])
def get_orders(
    status: Optional[str] = None,
    order_type: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    query = db.query(Order)
    if status and status != "all":
        query = query.filter(Order.status == status)
    if order_type and order_type != "all":
        query = query.filter(Order.order_type == order_type)
    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                Order.order_number.ilike(s),
                Order.customer_name.ilike(s),
                Order.customer_phone.ilike(s)
            )
        )
    return query.order_by(desc(Order.created_at)).offset(skip).limit(limit).all()

@router.get("/{order_ref}", response_model=OrderResponse)
def get_order_by_ref(order_ref: str, db: Session = Depends(get_db)):
    # Can be queried by id or by order_number
    if order_ref.isdigit():
        order = db.query(Order).filter(Order.id == int(order_ref)).first()
    else:
        order = db.query(Order).filter(Order.order_number == order_ref).first()
        
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = status_update.status
    if status_update.payment_status:
        order.payment_status = status_update.payment_status
    elif status_update.status == "completed":
        order.payment_status = "paid"
        
    db.commit()
    db.refresh(order)
    
    audit = AuditLog(
        admin_id=current_admin.id,
        admin_username=current_admin.username,
        action="STATUS_CHANGE",
        entity="Order",
        entity_id=str(order.id),
        details=f"Changed order #{order.order_number} status to {order.status}"
    )
    db.add(audit)
    db.commit()
    
    return order

@router.get("/{order_id}/invoice")
def get_order_invoice(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    settings = db.query(RestaurantSettings).first()
    return {
        "restaurant": {
            "name": settings.name if settings else "Khatab Restaurant & Café",
            "name_ar": settings.name_ar if settings else "مطعم وكافيه خطاب",
            "phone": settings.phone if settings else "",
            "address": settings.address if settings else "",
            "tax_percentage": settings.tax_percentage if settings else 5.0,
            "currency": settings.currency if settings else "EGP"
        },
        "order": order
    }
