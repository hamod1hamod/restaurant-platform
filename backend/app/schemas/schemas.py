from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ================= AUTH SCHEMAS =================
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "admin"

class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ================= SIZES & EXTRAS =================
class ProductSizeSchema(BaseModel):
    id: Optional[int] = None
    name: str
    name_ar: str
    price: float
    is_default: bool = False

    class Config:
        from_attributes = True

class ProductExtraSchema(BaseModel):
    id: Optional[int] = None
    name: str
    name_ar: str
    price: float = 0.0
    max_quantity: int = 1
    is_available: bool = True

    class Config:
        from_attributes = True

class ProductImageSchema(BaseModel):
    id: Optional[int] = None
    image_url: str
    is_primary: bool = False
    display_order: int = 0

    class Config:
        from_attributes = True

# ================= PRODUCT SCHEMAS =================
class ProductBase(BaseModel):
    category_id: int
    name: str
    name_ar: str
    description: Optional[str] = None
    description_ar: Optional[str] = None
    product_type: str = "Food"
    base_price: float
    discount_price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: bool = True
    is_featured: bool = False
    is_bestseller: bool = False
    is_new: bool = False
    is_vegetarian: bool = False
    is_spicy: bool = False
    ingredients: Optional[str] = None
    ingredients_ar: Optional[str] = None
    calories: Optional[int] = None
    prep_time_mins: int = 15
    display_order: int = 0

class ProductCreate(ProductBase):
    sizes: List[ProductSizeSchema] = []
    extras: List[ProductExtraSchema] = []
    images: List[ProductImageSchema] = []

class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    product_type: Optional[str] = None
    base_price: Optional[float] = None
    discount_price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    is_new: Optional[bool] = None
    is_vegetarian: Optional[bool] = None
    is_spicy: Optional[bool] = None
    ingredients: Optional[str] = None
    ingredients_ar: Optional[str] = None
    calories: Optional[int] = None
    prep_time_mins: Optional[int] = None
    display_order: Optional[int] = None
    sizes: Optional[List[ProductSizeSchema]] = None
    extras: Optional[List[ProductExtraSchema]] = None
    images: Optional[List[ProductImageSchema]] = None

class ProductResponse(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    sizes: List[ProductSizeSchema] = []
    extras: List[ProductExtraSchema] = []
    images: List[ProductImageSchema] = []

    class Config:
        from_attributes = True

# ================= CATEGORY SCHEMAS =================
class CategoryBase(BaseModel):
    name: str
    name_ar: str
    description: Optional[str] = None
    description_ar: Optional[str] = None
    image_url: Optional[str] = None
    icon: Optional[str] = "Utensils"
    display_order: int = 0
    is_active: bool = True
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    image_url: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None
    parent_id: Optional[int] = None

class CategoryResponse(CategoryBase):
    id: int
    product_count: Optional[int] = 0
    subcategories: Optional[List['CategoryResponse']] = []

    class Config:
        from_attributes = True

# ================= ORDER SCHEMAS =================
class OrderItemExtraCreate(BaseModel):
    extra_name: str
    extra_price: float = 0.0
    quantity: int = 1

class OrderItemExtraResponse(OrderItemExtraCreate):
    id: int
    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    product_name_ar: Optional[str] = None
    size_name: Optional[str] = None
    unit_price: float
    quantity: int = 1
    total_price: float
    special_instructions: Optional[str] = None
    extras: List[OrderItemExtraCreate] = []

class OrderItemResponse(OrderItemCreate):
    id: int
    extras: List[OrderItemExtraResponse] = []
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    delivery_address: Optional[str] = None
    order_type: str = "delivery"  # delivery, pickup, dine_in
    table_number: Optional[str] = None
    notes: Optional[str] = None
    payment_method: str = "cash_on_delivery"
    coupon_code: Optional[str] = None
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: str
    payment_status: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    delivery_address: Optional[str] = None
    order_type: str
    table_number: Optional[str] = None
    notes: Optional[str] = None
    status: str
    subtotal: float
    delivery_fee: float
    discount_amount: float
    total: float
    payment_method: str
    payment_status: str
    coupon_code: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

# ================= COUPONS =================
class CouponCreate(BaseModel):
    code: str
    discount_percent: Optional[float] = None
    discount_amount: Optional[float] = None
    min_order_value: float = 0.0
    max_discount: Optional[float] = None
    is_active: bool = True
    valid_until: Optional[datetime] = None

class CouponResponse(CouponCreate):
    id: int
    usage_count: int = 0
    class Config:
        from_attributes = True

class CouponValidateRequest(BaseModel):
    code: str
    subtotal: float

class CouponValidateResponse(BaseModel):
    valid: bool
    message: str
    discount_amount: float = 0.0
    code: Optional[str] = None

# ================= SETTINGS =================
class SettingsUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    logo_url: Optional[str] = None
    cover_url: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    address_ar: Optional[str] = None
    google_maps_url: Optional[str] = None
    opening_hours: Optional[str] = None
    social_links_json: Optional[str] = None
    hero_title: Optional[str] = None
    hero_title_ar: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_subtitle_ar: Optional[str] = None
    hero_image: Optional[str] = None
    primary_color: Optional[str] = None
    active_sections_json: Optional[str] = None
    currency: Optional[str] = None
    min_order_value: Optional[float] = None
    delivery_fee: Optional[float] = None
    tax_percentage: Optional[float] = None

class SettingsResponse(BaseModel):
    id: int
    name: str
    name_ar: str
    logo_url: Optional[str] = None
    cover_url: Optional[str] = None
    description: str
    description_ar: str
    phone: str
    whatsapp: str
    email: str
    address: str
    address_ar: str
    google_maps_url: str
    opening_hours: str
    social_links_json: str
    hero_title: str
    hero_title_ar: str
    hero_subtitle: str
    hero_subtitle_ar: str
    hero_image: str
    primary_color: str
    active_sections_json: str
    currency: str
    min_order_value: float
    delivery_fee: float
    tax_percentage: float

    class Config:
        from_attributes = True

# ================= REVIEWS =================
class ReviewCreate(BaseModel):
    customer_name: str
    rating: int = Field(..., ge=1, le=5)
    comment: str

class ReviewResponse(ReviewCreate):
    id: int
    is_approved: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
