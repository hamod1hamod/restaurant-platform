import os
from datetime import datetime, timedelta, timezone
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.models import (
    AdminUser, Category, Product, ProductSize, ProductExtra,
    Order, OrderItem, OrderItemExtra, Coupon, RestaurantSettings, Review
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(AdminUser).first():
            print("Database already contains data. Skipping initial seed.")
            return

        print("Seeding database with restaurant demo data...")

        # 1. Admin Account
        admin = AdminUser(
            username="admin",
            email="admin@restaurant.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Executive Chef & General Manager",
            role="superadmin",
            is_active=True
        )
        db.add(admin)

        # 2. Restaurant Settings & Landing Configuration
        settings = RestaurantSettings(
            id=1,
            name="Khatab Restaurant & Café",
            name_ar="مطعم وكافيه خطاب",
            logo_url="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&h=200&q=80",
            cover_url="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
            description="Award-winning culinary destination crafting artisan burgers, woodfired pizzas, prime grills, and decadent patisserie.",
            description_ar="وجهة طهي حائزة على جوائز تقدم برجر حرفي وبيتزا على الحطب ومشويات فاخرة وحلويات مميزة.",
            phone="+20 100 234 5678",
            whatsapp="+201002345678",
            email="reservations@khatab.example",
            address="26th of July St, Zamalek, Cairo, Egypt",
            address_ar="شارع ٢٦ يوليو، الزمالك، القاهرة، مصر",
            google_maps_url="https://maps.google.com/?q=Zamalek+Cairo+Egypt",
            opening_hours="Daily: 09:00 AM - 01:00 AM (Cairo Time)",
            social_links_json='{"facebook":"https://facebook.com","instagram":"https://instagram.com","twitter":"https://twitter.com","tiktok":"https://tiktok.com"}',
            hero_title="Masterpiece Flavors, Freshly Prepared",
            hero_title_ar="نكهات استثنائية محضرة بكل شغف",
            hero_subtitle="Indulge in our chef-crafted digital menu. Savor wood-fired crusts, certified Angus cuts, and handcrafted drinks delivered right to your table or doorstep.",
            hero_subtitle_ar="استمتع بقائمتنا الرقمية الغنية بالمأكولات الإيطالية والمشويات الفاخرة والعصائر الطازجة مع التوصيل السريع.",
            hero_image="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80",
            primary_color="#d92b21",
            active_sections_json='{"hero":true,"categories":true,"menu":true,"bestsellers":true,"offers":true,"gallery":true,"reviews":true,"about":true,"contact":true}',
            currency="EGP",
            min_order_value=150.0,
            delivery_fee=35.00,
            tax_percentage=14.0
        )
        db.add(settings)

        # 3. Categories
        categories_data = [
            {
                "name": "Burgers & Sandwiches",
                "name_ar": "برجر وسندويتشات",
                "description": "Juicy 100% Angus patties on toasted brioche buns with secret sauces",
                "description_ar": "لحم أنجوس فاخر ومحضر على خبز البريوش المحمص مع صلصاتنا الخاصة",
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
                "icon": "Sandwich",
                "display_order": 1
            },
            {
                "name": "Artisan Pizza & Pasta",
                "name_ar": "بيتزا وباستا إيطالية",
                "description": "Authentic stone-baked dough and handcrafted slow-simmered sauces",
                "description_ar": "عجينة إيطالية مخبوزة على الحجر مع صلصات غنية ومكونات طازجة",
                "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
                "icon": "Pizza",
                "display_order": 2
            },
            {
                "name": "Prime Grill & Steaks",
                "name_ar": "مشويات وستيك",
                "description": "Flame-broiled prime cuts, skewers and seasoned tender tenderloin",
                "description_ar": "قطع لحم ممتازة ومشوية على اللهب مع بهارات عطرية خاصة",
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
                "icon": "Flame",
                "display_order": 3
            },
            {
                "name": "Appetizers & Starters",
                "name_ar": "المقبلات والمشهيات",
                "description": "Crispy golden bites, artisan dips and shareable platters",
                "description_ar": "مقبلات مقرمشة وأطباق مشاركة شهية مع تغميسات مبتكرة",
                "image_url": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
                "icon": "Utensils",
                "display_order": 4
            },
            {
                "name": "Breakfast & Brunch",
                "name_ar": "فطور وبرنش",
                "description": "Fluffy golden pancakes, Benedicts and morning delicacies",
                "description_ar": "بان كيك ذهبي هش وبيض بندكت وألذ خيارات الصباح",
                "image_url": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
                "icon": "Coffee",
                "display_order": 5
            },
            {
                "name": "Desserts & Sweets",
                "name_ar": "حلويات ومخبوزات",
                "description": "Melt-in-your-mouth lava cakes, cheesecakes and gelato",
                "description_ar": "كيك الشوكولاتة الذائبة وتشيز كيك فاخر وآيس كريم إيطالي",
                "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
                "icon": "Cake",
                "display_order": 6
            },
            {
                "name": "Cold Drinks & Juices",
                "name_ar": "مشروبات وعصائر باردة",
                "description": "Cold-pressed fresh fruit juices, mojitos and iced teas",
                "description_ar": "عصائر طبيعية طازجة وموهيتو منعش ومشروبات مثلجة",
                "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
                "icon": "GlassWater",
                "display_order": 7
            },
            {
                "name": "Specialty Hot Coffee",
                "name_ar": "قهوة مختصة ساخنة",
                "description": "Single-origin Arabica roasts brewed with precision",
                "description_ar": "حبوب بن أرابيكا مختصة ومحمصة بعناية فائقة",
                "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
                "icon": "CupSoda",
                "display_order": 8
            }
        ]

        created_cats = {}
        for cdata in categories_data:
            cat = Category(**cdata, is_active=True)
            db.add(cat)
            db.flush()
            created_cats[cat.name] = cat

        # 4. Products with sizes and extras
        products_data = [
            # Burgers
            {
                "category": "Burgers & Sandwiches",
                "name": "Truffle Angus Beast Burger",
                "name_ar": "برجر أنجوس بالكمأة الفاخرة",
                "description": "Double Angus beef patty, melted aged gruyere cheese, black truffle aioli, caramelized onions on buttery brioche.",
                "description_ar": "قطعتين من لحم الأنجوس مع جبن الغرويير المعتق وصلصة الكمأة السوداء والبصل المكرمل.",
                "product_type": "Food",
                "base_price": 14.50,
                "discount_price": 12.99,
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
                "is_spicy": False,
                "is_vegetarian": False,
                "calories": 780,
                "prep_time_mins": 15,
                "ingredients": "Angus Beef, Aged Gruyere, Black Truffle, Brioche, Caramelized Onions",
                "ingredients_ar": "لحم أنجوس، جبن غرويير، كمأة سوداء، بريوش، بصل مكرمل",
                "sizes": [
                    {"name": "Single Patty (150g)", "name_ar": "قطعة واحدة (١٥٠ جم)", "price": 12.99, "is_default": True},
                    {"name": "Double Patty (300g)", "name_ar": "قطعتين (٣٠٠ جم)", "price": 16.50, "is_default": False},
                    {"name": "Triple Monster (450g)", "name_ar": "ثلاث قطع (٤٥٠ جم)", "price": 19.99, "is_default": False}
                ],
                "extras": [
                    {"name": "Extra Truffle Aioli", "name_ar": "صلصة كمأة إضافية", "price": 1.50},
                    {"name": "Crispy Beef Bacon", "name_ar": "بيكون بقري مقرمش", "price": 2.25},
                    {"name": "Double Cheddar Slice", "name_ar": "شريحة شيدر مضاعفة", "price": 1.25}
                ]
            },
            {
                "category": "Burgers & Sandwiches",
                "name": "Fiery Nashville Crispy Chicken",
                "name_ar": "ساندوتش دجاج ناشفيل الحار",
                "description": "Crisp buttermilk fried chicken tossed in Nashville cayenne chili oil, spicy slaw, house pickles and hot honey.",
                "description_ar": "صدر دجاج مقرمش مغمس بصلصة ناشفيل الحارة مع كول سلو حار ومخلل وعسل حار.",
                "product_type": "Food",
                "base_price": 11.99,
                "discount_price": None,
                "image_url": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "is_bestseller": True,
                "is_new": True,
                "is_spicy": True,
                "is_vegetarian": False,
                "calories": 650,
                "prep_time_mins": 12,
                "ingredients": "Buttermilk Fried Chicken, Hot Oil, Spicy Slaw, Pickles, Hot Honey",
                "ingredients_ar": "دجاج مقرمش، زيت فلفل حار، سلطة ملفوف حارة، مخلل، عسل حار",
                "sizes": [
                    {"name": "Mild Heat", "name_ar": "حرارة خفيفة", "price": 11.99, "is_default": True},
                    {"name": "Blazing Hot", "name_ar": "حار ناري", "price": 11.99, "is_default": False}
                ],
                "extras": [
                    {"name": "Melted American Cheese", "name_ar": "جبن أمريكي ذائب", "price": 1.00},
                    {"name": "Side Seasoned Waffle Fries", "name_ar": "بطاطس وافل مبهرة", "price": 2.99}
                ]
            },

            # Pizza & Pasta
            {
                "category": "Artisan Pizza & Pasta",
                "name": "Smoked Burrata & Margherita Pizza",
                "name_ar": "بيتزا مارغريتا مع جبن البوراتا المدخن",
                "description": "San Marzano organic tomato sauce, whole imported burrata ball, fresh sweet basil and extra virgin olive oil.",
                "description_ar": "صلصة طماطم سان مارزانو الإيطالية، كرة بوراتا كاملة، ريحان طازج وزيت زيتون بكر.",
                "product_type": "Food",
                "base_price": 16.00,
                "discount_price": 14.00,
                "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
                "is_spicy": False,
                "is_vegetarian": True,
                "calories": 720,
                "prep_time_mins": 18,
                "ingredients": "Sourdough Crust, San Marzano Tomatoes, Burrata, Basil, EVOO",
                "ingredients_ar": "عجينة مخمرة، طماطم سان مارزانو، بوراتا، ريحان، زيت زيتون",
                "sizes": [
                    {"name": "Medium 10-inch", "name_ar": "وسط ١٠ إنش", "price": 14.00, "is_default": True},
                    {"name": "Large 14-inch", "name_ar": "كبير ١٤ إنش", "price": 18.50, "is_default": False}
                ],
                "extras": [
                    {"name": "Extra Buffalo Mozzarella", "name_ar": "موزاريلا بافلو إضافية", "price": 2.50},
                    {"name": "Hot Chili Flakes & Garlic Dip", "name_ar": "رقائق شطة وصلصة ثوم", "price": 1.00}
                ]
            },
            {
                "category": "Artisan Pizza & Pasta",
                "name": "Creamy Black Truffle Fettuccine",
                "name_ar": "فيتوتشيني ألفريدو بالكمأة السوداء",
                "description": "Handmade egg pasta ribbons tossed in velvety 24-month Parmigiano-Reggiano cream and shaved seasonal truffle.",
                "description_ar": "باستا بيض طازجة محضرة يدوياً مع كريمة بارميجيانو ريجيانو معتقة وشرائح الكمأة.",
                "product_type": "Food",
                "base_price": 17.50,
                "discount_price": None,
                "image_url": "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "is_bestseller": False,
                "is_new": True,
                "is_spicy": False,
                "is_vegetarian": True,
                "calories": 610,
                "prep_time_mins": 15,
                "ingredients": "Egg Fettuccine, Heavy Cream, Parmigiano, Black Truffle, White Pepper",
                "ingredients_ar": "فيتوتشيني، كريمة طازجة، بارميزان، كمأة، فلفل أبيض",
                "sizes": [
                    {"name": "Regular Portion", "name_ar": "طبق عادي", "price": 17.50, "is_default": True},
                    {"name": "Sharing Platter", "name_ar": "طبق عائلي للمشاركة", "price": 27.00, "is_default": False}
                ],
                "extras": [
                    {"name": "Add Grilled Chicken Strips", "name_ar": "إضافة شرائح دجاج مشوي", "price": 3.50},
                    {"name": "Add Pan-Seared Tiger Prawns", "name_ar": "إضافة روبيان مقلي", "price": 5.00}
                ]
            },

            # Grill & Steaks
            {
                "category": "Prime Grill & Steaks",
                "name": "Wood-Fired Ribeye Steak (350g)",
                "name_ar": "ستيك ريب آي مشوي على الحطب (٣٥٠ جم)",
                "description": "Certified USDA Prime ribeye seared over hickory coals, served with rosemary garlic butter and glazed asparagus.",
                "description_ar": "ريب آي أمريكي فاخر مشوي على فحم الخشب مع زبدة الروزماري والثوم والهليون المشوي.",
                "product_type": "Food",
                "base_price": 32.00,
                "discount_price": 28.50,
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
                "is_spicy": False,
                "is_vegetarian": False,
                "calories": 840,
                "prep_time_mins": 25,
                "ingredients": "Prime Beef Ribeye, Rosemary, Sea Salt, Butter, Grilled Asparagus",
                "ingredients_ar": "ستيك لحم بقري، روزماري، ملح بحري، زبدة، هليون مشوي",
                "sizes": [
                    {"name": "Medium-Rare (350g)", "name_ar": "نصف استواء (٣٥٠ جم)", "price": 28.50, "is_default": True},
                    {"name": "Medium-Well (350g)", "name_ar": "مستوي جيداً (٣٥٠ جم)", "price": 28.50, "is_default": False},
                    {"name": "Grand Tomahawk (800g)", "name_ar": "توماهوك كبير (٨٠٠ جم)", "price": 58.00, "is_default": False}
                ],
                "extras": [
                    {"name": "Mushroom Peppercorn Sauce", "name_ar": "صلصة فطر بالفلفل الأسود", "price": 2.50},
                    {"name": "Truffle Mashed Potatoes", "name_ar": "بطاطس مهروسة بالكمأة", "price": 3.50}
                ]
            },

            # Appetizers
            {
                "category": "Appetizers & Starters",
                "name": "Crispy Loaded Truffle Fries",
                "name_ar": "بطاطس مقرمشة بالكمأة وجبن البارميزان",
                "description": "Skinny golden cut fries tossed in white truffle oil, grated parmesan cheese, fresh chopped parsley and garlic dip.",
                "description_ar": "بطاطس ذهبية مقرمشة مع زيت الكمأة الأبيض وجبن البارميزان المبشور والبقدونس.",
                "product_type": "Food",
                "base_price": 7.50,
                "discount_price": None,
                "image_url": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "is_bestseller": True,
                "is_new": False,
                "is_spicy": False,
                "is_vegetarian": True,
                "calories": 420,
                "prep_time_mins": 8,
                "ingredients": "Potatoes, Truffle Oil, Parmesan, Fresh Herbs",
                "ingredients_ar": "بطاطس، زيت كمأة، بارميزان، أعشاب طازجة",
                "sizes": [
                    {"name": "Regular Box", "name_ar": "حجم عادي", "price": 7.50, "is_default": True},
                    {"name": "Sharing Platter", "name_ar": "طبق مشاركة كبير", "price": 11.50, "is_default": False}
                ],
                "extras": [
                    {"name": "Melted Cheddar Lava Dip", "name_ar": "صوص جبن شيدر ذائب", "price": 1.75}
                ]
            },

            # Breakfast
            {
                "category": "Breakfast & Brunch",
                "name": "Brioche French Toast & Berry Compote",
                "name_ar": "فرينش توست البريوش مع صوص التوت",
                "description": "Thick-sliced golden brioche soaked in cinnamon custard, vanilla bean whipped mascarpone, and warm organic maple syrup.",
                "description_ar": "خبز بريوش سميك محمص بالقرفة والفانيليا مع جبن الماسكاربوني وصوص التوت البري وشراب القيقب.",
                "product_type": "Food",
                "base_price": 10.50,
                "discount_price": 8.99,
                "image_url": "https://images.unsplash.com/photo-1484723091739-0045615b119a?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "is_bestseller": True,
                "is_new": False,
                "is_spicy": False,
                "is_vegetarian": True,
                "calories": 530,
                "prep_time_mins": 10,
                "ingredients": "Brioche Bread, Eggs, Cinnamon, Mascarpone, Wild Berries, Maple Syrup",
                "ingredients_ar": "خبز بريوش، بيض، قرفة، ماسكاربوني، توت بري، شراب القيقب",
                "sizes": [
                    {"name": "2 Slices", "name_ar": "شريحتين", "price": 8.99, "is_default": True},
                    {"name": "4 Slices Feast", "name_ar": "٤ شرائح عائلية", "price": 14.50, "is_default": False}
                ],
                "extras": [
                    {"name": "Nutella Drizzle", "name_ar": "صوص نوتيلا إضافي", "price": 1.50},
                    {"name": "Extra Vanilla Ice Cream Scoop", "name_ar": "كرة آيس كريم فانيليا", "price": 2.00}
                ]
            },

            # Desserts
            {
                "category": "Desserts & Sweets",
                "name": "Warm Belgian Chocolate Lava Cake",
                "name_ar": "كيك الشوكولاتة البلجيكية الذائبة (لافا كيك)",
                "description": "Rich 70% dark Belgian cocoa cake with an oozing liquid center, served warm with Madagascar vanilla gelato.",
                "description_ar": "كيك شوكولاتة بلجيكية داكنة فاخرة مع حشوة سائلة ذائبة تقدم دافئة مع آيس كريم فانيليا مدغشقر.",
                "product_type": "Desserts",
                "base_price": 8.50,
                "discount_price": None,
                "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
                "is_spicy": False,
                "is_vegetarian": True,
                "calories": 480,
                "prep_time_mins": 12,
                "ingredients": "Belgian Chocolate, Butter, Farm Eggs, Sugar, Vanilla Gelato",
                "ingredients_ar": "شوكولاتة بلجيكية، زبدة، بيض، سكر، آيس كريم فانيليا",
                "sizes": [
                    {"name": "Individual Cake", "name_ar": "حصة فردية", "price": 8.50, "is_default": True}
                ],
                "extras": [
                    {"name": "Extra Pistachio Sauce", "name_ar": "صوص فستق حلبي غني", "price": 1.75}
                ]
            },

            # Cold Drinks
            {
                "category": "Cold Drinks & Juices",
                "name": "Passion Fruit & Mint Sparkler",
                "name_ar": "موهيتو الباشن فروت والنعناع المنعش",
                "description": "Crushed fresh passion fruit pulp, garden spearmint, lime wedges and sparkling spring water over crushed ice.",
                "description_ar": "لب باشن فروت طازج مع أوراق النعناع وقطع الليمون والمياه الفوارة المنعشة على الثلج المجروش.",
                "product_type": "Drinks",
                "base_price": 5.50,
                "discount_price": 4.50,
                "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "is_bestseller": True,
                "is_new": True,
                "is_spicy": False,
                "is_vegetarian": True,
                "calories": 140,
                "prep_time_mins": 4,
                "ingredients": "Passion Fruit, Fresh Mint, Lime, Sparkling Water",
                "ingredients_ar": "باشن فروت، نعناع طازج، ليمون، مياه فوارة",
                "sizes": [
                    {"name": "Regular (400ml)", "name_ar": "وسط (٤٠٠ مل)", "price": 4.50, "is_default": True},
                    {"name": "Large (650ml)", "name_ar": "كبير (٦٥٠ مل)", "price": 6.00, "is_default": False}
                ],
                "extras": [
                    {"name": "Add Chia Seeds", "name_ar": "إضافة بذور الشيا", "price": 0.75}
                ]
            },

            # Hot Coffee
            {
                "category": "Specialty Hot Coffee",
                "name": "Spanish Caramel Cortado",
                "name_ar": "كورتادو بالكراميل الإسباني",
                "description": "Double espresso shot combined with steamed silky whole milk and sweet condensed dulce de leche.",
                "description_ar": "جرعة إسبريسو مضاعفة مع حليب مبخر حريري ولمسة دولسي دي ليتشي الغنية.",
                "product_type": "Drinks",
                "base_price": 4.75,
                "discount_price": None,
                "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "is_bestseller": False,
                "is_new": True,
                "is_spicy": False,
                "is_vegetarian": True,
                "calories": 160,
                "prep_time_mins": 3,
                "ingredients": "Arabica Espresso, Steamed Milk, Dulce de Leche",
                "ingredients_ar": "إسبريسو أرابيكا، حليب مبخر، كراميل حليبي",
                "sizes": [
                    {"name": "Double Shot (6oz)", "name_ar": "جرعة مضاعفة (٦ أونصة)", "price": 4.75, "is_default": True}
                ],
                "extras": [
                    {"name": "Oat Milk Substitute", "name_ar": "استبدال بحليب الشوفان", "price": 0.85}
                ]
            }
        ]

        for pdata in products_data:
            cat = created_cats[pdata["category"]]
            sizes = pdata.pop("sizes")
            extras = pdata.pop("extras")
            cat_name = pdata.pop("category")
            
            product = Product(category_id=cat.id, **pdata)
            db.add(product)
            db.flush()
            
            for s in sizes:
                db.add(ProductSize(product_id=product.id, **s))
            for e in extras:
                db.add(ProductExtra(product_id=product.id, **e))

        # 5. Promo Coupons
        coupons = [
            Coupon(code="WELCOME10", discount_percent=10.0, min_order_value=20.0, is_active=True),
            Coupon(code="KHATAB20", discount_percent=20.0, min_order_value=40.0, is_active=True),
            Coupon(code="SAVE5", discount_amount=5.0, min_order_value=25.0, is_active=True),
        ]
        for cp in coupons:
            db.add(cp)

        # 6. Reviews
        reviews = [
            Review(
                customer_name="Sophia Martinez",
                rating=5,
                comment="The Truffle Angus Burger is hands down the best burger in the city! Piping hot and delivered in 25 minutes.",
                is_approved=True
            ),
            Review(
                customer_name="Abdullah Al-Mansoor",
                rating=5,
                comment="تجربة ممتازة جداً! الستيك مشوي بإتقان والبوراتا بيتزا لا تقاوم. التغليف والتوصيل في غاية الرقي.",
                is_approved=True
            ),
            Review(
                customer_name="Liam Henderson",
                rating=5,
                comment="Incredible ambiance and modern digital ordering. The chocolate lava cake is pure heaven.",
                is_approved=True
            )
        ]
        for rev in reviews:
            db.add(rev)

        # 7. Initial Demo Orders (to populate dashboard graphs & customer analytics right away)
        demo_orders = [
            {
                "customer_name": "James Wilson",
                "customer_phone": "+1 555-432-1100",
                "customer_email": "james@example.com",
                "delivery_address": "88 Elm Street, Apt 4B",
                "order_type": "delivery",
                "status": "completed",
                "subtotal": 42.49,
                "delivery_fee": 3.50,
                "discount_amount": 4.25,
                "total": 41.74,
                "payment_method": "card",
                "payment_status": "paid",
                "days_ago": 3,
                "items": [
                    {"product_name": "Truffle Angus Beast Burger", "unit_price": 12.99, "qty": 2, "total": 25.98},
                    {"product_name": "Crispy Loaded Truffle Fries", "unit_price": 7.50, "qty": 1, "total": 7.50},
                    {"product_name": "Passion Fruit & Mint Sparkler", "unit_price": 4.50, "qty": 2, "total": 9.00}
                ]
            },
            {
                "customer_name": "Noura Al-Hassan",
                "customer_phone": "+966 50 123 4567",
                "customer_email": "noura@example.com",
                "delivery_address": "King Fahd Road, Tower 2",
                "order_type": "delivery",
                "status": "completed",
                "subtotal": 56.50,
                "delivery_fee": 3.50,
                "discount_amount": 0.0,
                "total": 60.00,
                "payment_method": "cash_on_delivery",
                "payment_status": "paid",
                "days_ago": 1,
                "items": [
                    {"product_name": "Smoked Burrata & Margherita Pizza", "unit_price": 14.00, "qty": 2, "total": 28.00},
                    {"product_name": "Wood-Fired Ribeye Steak (350g)", "unit_price": 28.50, "qty": 1, "total": 28.50}
                ]
            },
            {
                "customer_name": "Michael Chang",
                "customer_phone": "+1 555-987-6543",
                "customer_email": "mchang@example.com",
                "delivery_address": "Table #5 (Dine-in)",
                "order_type": "dine_in",
                "table_number": "5",
                "status": "preparing",
                "subtotal": 29.49,
                "delivery_fee": 0.0,
                "discount_amount": 0.0,
                "total": 29.49,
                "payment_method": "card",
                "payment_status": "paid",
                "days_ago": 0,
                "items": [
                    {"product_name": "Fiery Nashville Crispy Chicken", "unit_price": 11.99, "qty": 1, "total": 11.99},
                    {"product_name": "Warm Belgian Chocolate Lava Cake", "unit_price": 8.50, "qty": 1, "total": 8.50},
                    {"product_name": "Spanish Caramel Cortado", "unit_price": 4.75, "qty": 1, "total": 4.75}
                ]
            }
        ]

        now = datetime.now()
        for do in demo_orders:
            days = do.pop("days_ago")
            items = do.pop("items")
            order_time = now - timedelta(days=days, hours=2)
            
            ord_obj = Order(**do, created_at=order_time)
            db.add(ord_obj)
            db.flush()
            
            for itm in items:
                db.add(OrderItem(
                    order_id=ord_obj.id,
                    product_name=itm["product_name"],
                    unit_price=itm["unit_price"],
                    quantity=itm["qty"],
                    total_price=itm["total"]
                ))

        db.commit()
        print("Database successfully seeded with comprehensive demo data!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
