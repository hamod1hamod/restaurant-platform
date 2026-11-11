import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def get_utc_now():
    return datetime.now(timezone.utc)

def generate_order_number():
    now = datetime.now()
    return f"ORD-{now.strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

class AdminUser(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), default="admin") # superadmin, admin, manager, staff
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=get_utc_now)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    icon = Column(String(50), default="Utensils")
    display_order = Column(Integer, default=0, index=True)
    is_active = Column(Boolean, default=True, index=True)
    parent_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)

    parent = relationship("Category", remote_side=[id], backref="subcategories")
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    name_ar = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    product_type = Column(String(50), default="Food")  # Food, Drinks, Desserts, Snacks, Combos, Special Offers
    base_price = Column(Float, nullable=False, default=0.0)
    discount_price = Column(Float, nullable=True)
    image_url = Column(String(500), nullable=True)
    
    # Flags & Badges
    is_available = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False, index=True)
    is_bestseller = Column(Boolean, default=False, index=True)
    is_new = Column(Boolean, default=False)
    is_vegetarian = Column(Boolean, default=False)
    is_spicy = Column(Boolean, default=False)
    
    # Additional Details
    ingredients = Column(Text, nullable=True)
    ingredients_ar = Column(Text, nullable=True)
    calories = Column(Integer, nullable=True)
    prep_time_mins = Column(Integer, default=15)
    display_order = Column(Integer, default=0, index=True)
    
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    category = relationship("Category", back_populates="products")
    sizes = relationship("ProductSize", back_populates="product", cascade="all, delete-orphan", order_by="ProductSize.price")
    extras = relationship("ProductExtra", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=False)
    is_primary = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)

    product = relationship("Product", back_populates="images")

class ProductSize(Base):
    __tablename__ = "product_sizes"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(50), nullable=False)        # e.g., Small, Medium, Large
    name_ar = Column(String(50), nullable=False)     # e.g., صغير, متوسط, كبير
    price = Column(Float, nullable=False)            # absolute price or extra price
    is_default = Column(Boolean, default=False)

    product = relationship("Product", back_populates="sizes")

class ProductExtra(Base):
    __tablename__ = "product_extras"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)       # e.g., Extra Cheese
    name_ar = Column(String(100), nullable=False)    # e.g., جبنة إضافية
    price = Column(Float, nullable=False, default=0.0)
    max_quantity = Column(Integer, default=1)
    is_available = Column(Boolean, default=True)

    product = relationship("Product", back_populates="extras")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(30), unique=True, index=True, default=generate_order_number)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(30), nullable=False, index=True)
    customer_email = Column(String(100), nullable=True)
    delivery_address = Column(Text, nullable=True)
    order_type = Column(String(20), default="delivery") # delivery, pickup, dine_in
    table_number = Column(String(20), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Order Status: new, confirmed, preparing, ready, out_for_delivery, completed, cancelled
    status = Column(String(30), default="new", index=True)
    
    # Calculations
    subtotal = Column(Float, nullable=False, default=0.0)
    delivery_fee = Column(Float, nullable=False, default=0.0)
    discount_amount = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False, default=0.0)
    
    # Payment
    payment_method = Column(String(30), default="cash_on_delivery") # cash, cash_on_delivery, card, online
    payment_status = Column(String(20), default="pending") # pending, paid, failed, refunded
    coupon_code = Column(String(50), nullable=True)
    
    created_at = Column(DateTime, default=get_utc_now, index=True)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, nullable=True)
    product_name = Column(String(150), nullable=False)
    product_name_ar = Column(String(150), nullable=True)
    size_name = Column(String(50), nullable=True)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    special_instructions = Column(Text, nullable=True)

    order = relationship("Order", back_populates="items")
    extras = relationship("OrderItemExtra", back_populates="order_item", cascade="all, delete-orphan")

class OrderItemExtra(Base):
    __tablename__ = "order_item_extras"

    id = Column(Integer, primary_key=True, index=True)
    order_item_id = Column(Integer, ForeignKey("order_items.id", ondelete="CASCADE"), nullable=False, index=True)
    extra_name = Column(String(100), nullable=False)
    extra_price = Column(Float, default=0.0)
    quantity = Column(Integer, default=1)

    order_item = relationship("OrderItem", back_populates="extras")

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_percent = Column(Float, nullable=True)  # e.g., 15 for 15%
    discount_amount = Column(Float, nullable=True)   # fixed discount e.g., 5.0
    min_order_value = Column(Float, default=0.0)
    max_discount = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    usage_count = Column(Integer, default=0)
    valid_until = Column(DateTime, nullable=True)

class RestaurantSettings(Base):
    __tablename__ = "restaurant_settings"

    id = Column(Integer, primary_key=True, default=1)
    name = Column(String(100), default="Gourmet Haven")
    name_ar = Column(String(100), default="ملاذ الذواقة")
    logo_url = Column(String(500), nullable=True)
    cover_url = Column(String(500), nullable=True)
    description = Column(Text, default="Experience unforgettable culinary craft with fresh artisan ingredients and passion.")
    description_ar = Column(Text, default="تجربة طهي استثنائية مع أجود المكونات الطازجة وأشهى النكهات الأصيلة.")
    phone = Column(String(50), default="+1 (555) 234-5678")
    whatsapp = Column(String(50), default="+15552345678")
    email = Column(String(100), default="contact@gourmethaven.com")
    address = Column(String(255), default="742 Evergreen Terrace, Springfield")
    address_ar = Column(String(255), default="شارع النخيل، حي الزهور، الرياض")
    google_maps_url = Column(String(500), default="https://maps.google.com")
    opening_hours = Column(String(255), default="Mon - Sun: 10:00 AM - 12:00 AM")
    social_links_json = Column(Text, default='{"facebook":"#","instagram":"#","twitter":"#","tiktok":"#"}')
    
    # Landing Page Visual Settings
    hero_title = Column(String(200), default="Masterpiece Flavors, Freshly Prepared")
    hero_title_ar = Column(String(200), default="نكهات متميزة، محضرة بكل شغف")
    hero_subtitle = Column(String(300), default="Discover our chef-curated digital menu with handcrafted meals, sizzling grills, artisan pizzas, and exquisite desserts.")
    hero_subtitle_ar = Column(String(300), default="استكشف قائمتنا الرقمية الغنية بالمأكولات الشهية والمشويات الطازجة والحلويات الفاخرة.")
    hero_image = Column(String(500), default="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80")
    primary_color = Column(String(30), default="#ea580c") # Orange-600
    active_sections_json = Column(Text, default='{"hero":true,"categories":true,"menu":true,"bestsellers":true,"offers":true,"gallery":true,"reviews":true,"about":true,"contact":true}')
    
    currency = Column(String(10), default="USD") # USD, SAR, AED, EUR, etc.
    min_order_value = Column(Float, default=15.0)
    delivery_fee = Column(Float, default=3.99)
    tax_percentage = Column(Float, default=5.0)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    rating = Column(Integer, default=5)
    comment = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=get_utc_now)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, nullable=True)
    admin_username = Column(String(50), nullable=True)
    action = Column(String(50), nullable=False) # CREATE, UPDATE, DELETE, STATUS_CHANGE
    entity = Column(String(50), nullable=False) # Product, Category, Order, Settings
    entity_id = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)
