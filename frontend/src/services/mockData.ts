import { Category, Product, RestaurantSettings, Review, Coupon, Order, AdminUser } from '../types';

export const mockSettings: RestaurantSettings = {
  id: 1,
  name: "Gourmet Haven",
  name_ar: "ملاذ النكهات الراقية",
  description: "Experience world-class culinary masterpieces prepared with locally sourced organic ingredients, handcrafted by our master chefs.",
  description_ar: "استمتع بأشهى الأطباق العالمية المحضرة بأجود المكونات العضوية الطازجة بأيدي أمهر الطهاة.",
  phone: "+1 (555) 234-5678",
  whatsapp: "+1 (555) 234-5678",
  email: "contact@gourmethaven.com",
  address: "450 Grand Avenue, Financial District, New York, NY 10001",
  address_ar: "٤٥٠ شارع جراند، الحي المالي، نيويورك",
  opening_hours: "Monday - Sunday: 10:00 AM - 11:30 PM",
  google_maps_url: "https://maps.google.com",
  social_links_json: "{}",
  hero_title: "Where Every Flavor Tells a Story",
  hero_title_ar: "حيث تروي كل نكهة قصة استثنائية",
  hero_subtitle: "Handcrafted gourmet burgers, wood-fired artisan pizzas, prime-aged steaks, and signature desserts.",
  hero_subtitle_ar: "برجر فاخر محضّر يدوياً، بيتزا على الحطب، ستيك معتق فاخر، وألذ الحلويات والمشروبات المنعشة.",
  hero_image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80",
  primary_color: "#e11d48",
  active_sections_json: "{}",
  delivery_fee: 4.99,
  min_order_value: 15.00,
  tax_percentage: 8.5,
  currency: "$"
};

export const mockCategories: Category[] = [
  { id: 1, name: "Gourmet Burgers", name_ar: "برجر فاخر", description: "Fresh Angus beef and brioche buns", description_ar: "لحم أنجوس طازج وخبز البريوش الذهبي", display_order: 1, is_active: true, icon: "Utensils", product_count: 2 },
  { id: 2, name: "Prime Steaks & Grills", name_ar: "ستيك ومشويات فاخرة", description: "Aged cuts grilled to perfection", description_ar: "قطع لحم ممتازة مشوية بعناية", display_order: 2, is_active: true, icon: "Flame", product_count: 1 },
  { id: 3, name: "Artisan Pizza", name_ar: "بيتزا إيطالية على الحطب", description: "Authentic Neapolitan wood-fired pizza", description_ar: "عجينة نابولية مخمرة ومخبوزة على الحطب", display_order: 3, is_active: true, icon: "Pizza", product_count: 1 },
  { id: 4, name: "Signature Pasta", name_ar: "باستا إيطالية طازجة", description: "Handmade pasta with rich sauces", description_ar: "باستا طازجة محضرة يدوياً مع أشهى الصلصات", display_order: 4, is_active: true, icon: "UtensilsCrossed", product_count: 1 },
  { id: 5, name: "Starters & Appetizers", name_ar: "مقبلات ومقبلات مقرمشة", description: "Delicious bites to begin your feast", description_ar: "مقبلات شهية لبداية مثالية", display_order: 5, is_active: true, icon: "Soup", product_count: 1 },
  { id: 6, name: "Decadent Desserts", name_ar: "حلويات فرنسية فاخرة", description: "Sweet master creations", description_ar: "إبداعات حلوة لا تُقاوم", display_order: 6, is_active: true, icon: "Cake", product_count: 1 },
  { id: 7, name: "Fresh Juices & Shakes", name_ar: "عصائر طبيعية وميلك شيك", description: "Cold-pressed juices and thick shakes", description_ar: "عصائر طبيعية معصورة ومخفوقات غنية", display_order: 7, is_active: true, icon: "GlassWater", product_count: 1 },
  { id: 8, name: "Specialty Coffee", name_ar: "قهوة مختصة وساخنة", description: "Single-origin beans expertly brewed", description_ar: "حبوب بن أحادية المصدر محضرة باحتراف", display_order: 8, is_active: true, icon: "Coffee", product_count: 1 }
];

export const mockProducts: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "Truffle Wagyu Supreme Burger",
    name_ar: "واغيو ترافل برجر الملكي",
    description: "200g premium Wagyu beef patty, black truffle aioli, aged cheddar, caramelized shallots, arugula on buttered brioche bun.",
    description_ar: "قطعة لحم واغيو فاخرة ٢٠٠ جرام مع صلصة الترافل الأسود، جبنة شيدر معتقة، بصل مكرمل وجرجير طازج في خبز بريوش محمص بالزبدة.",
    product_type: "Food",
    base_price: 18.99,
    discount_price: 16.49,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    is_available: true,
    is_featured: true,
    is_bestseller: true,
    is_new: false,
    is_vegetarian: false,
    is_spicy: false,
    ingredients: "Wagyu beef, Truffle aioli, Brioche, Aged cheddar, Arugula, Caramelized shallots",
    ingredients_ar: "لحم واغيو، صلصة ترافل، خبز بريوش، جبن شيدر، جرجير، بصل مكرمل",
    calories: 850,
    prep_time_mins: 15,
    display_order: 1,
    sizes: [
      { id: 1, name: "Single Patty (200g)", name_ar: "شريحة واحدة (٢٠٠جم)", price: 18.99, is_default: true },
      { id: 2, name: "Double Wagyu (400g)", name_ar: "شريحتين واغيو (٤٠٠جم)", price: 25.99 }
    ],
    extras: [
      { id: 1, name: "Extra Aged Cheddar", name_ar: "جبن شيدر إضافي", price: 2.00, max_quantity: 2 },
      { id: 2, name: "Crispy Beef Bacon", name_ar: "بيكون بقري مقرمش", price: 3.50, max_quantity: 2 },
      { id: 3, name: "Truffle Fries Combo", name_ar: "كومبو بطاطس بالترافل والمشروب", price: 4.50, max_quantity: 1 }
    ],
    images: []
  },
  {
    id: 2,
    category_id: 1,
    name: "Smoky Chipotle Crunch Burger",
    name_ar: "برجر شيبوتلي المدخن المقرمش",
    description: "Crispy fried free-range chicken breast dipped in smoky chipotle sauce, pickled jalapeños, purple slaw on sesame brioche.",
    description_ar: "صدر دجاج مقرمش متبل بخلطة الشيبوتلي المدخنة الحارة، هالبينو مخلل، سلطة ملفوف بنفسجية في خبز بريوش بالسمسم.",
    product_type: "Food",
    base_price: 14.50,
    image_url: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    is_available: true,
    is_featured: false,
    is_bestseller: true,
    is_new: true,
    is_vegetarian: false,
    is_spicy: true,
    ingredients: "Crispy chicken, Chipotle glaze, Jalapeños, Purple slaw, Sesame brioche",
    ingredients_ar: "دجاج مقرمش، تتبيلة شيبوتلي، هالبينو، سلطة ملفوف، خبز سمسم",
    calories: 720,
    prep_time_mins: 12,
    display_order: 2,
    sizes: [
      { id: 3, name: "Regular Crunch", name_ar: "الحجم العادي", price: 14.50, is_default: true },
      { id: 4, name: "Mega Double Crunch", name_ar: "دبل دجاج مقرمش", price: 19.50 }
    ],
    extras: [
      { id: 4, name: "Extra Chipotle Sauce", name_ar: "صلصة شيبوتلي إضافية", price: 1.50, max_quantity: 3 },
      { id: 5, name: "Spicy Seasoned Wedges", name_ar: "بطاطس ودجز متبلة حارة", price: 3.00, max_quantity: 1 }
    ],
    images: []
  },
  {
    id: 3,
    category_id: 2,
    name: "Ribeye Steak 350g with Herb Butter",
    name_ar: "ستيك ريب آي ٣٥٠جم بخلطة زبدة الأعشاب",
    description: "Dry-aged Black Angus ribeye flame-grilled, accompanied by roasted garlic bulb, rosemary jus, and truffle mashed potatoes.",
    description_ar: "ستيك بلاك أنجوس ريب آي معتق مشوي على اللهب، يقدم مع ثوم مشوي، صوص إكليل الجبل وبطاطس بيوريه بالترافل.",
    product_type: "Food",
    base_price: 34.00,
    discount_price: 29.99,
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    is_available: true,
    is_featured: true,
    is_bestseller: true,
    is_new: false,
    is_vegetarian: false,
    is_spicy: false,
    ingredients: "Black Angus ribeye, Truffle mash, Herb butter, Garlic, Rosemary",
    ingredients_ar: "لحم ريب آي أنجوس، بيوريه ترافل، زبدة أعشاب، ثوم، روزماري",
    calories: 950,
    prep_time_mins: 22,
    display_order: 3,
    sizes: [
      { id: 5, name: "Medium Rare (Recommended)", name_ar: "ميديم رير (موصى به)", price: 34.00, is_default: true },
      { id: 6, name: "Medium Well", name_ar: "ميديم ويل", price: 34.00 }
    ],
    extras: [
      { id: 6, name: "Grilled Jumbo Prawns (2 pcs)", name_ar: "روبيان جامبو مشوي (قطعتين)", price: 8.00, max_quantity: 2 }
    ],
    images: []
  },
  {
    id: 4,
    category_id: 3,
    name: "Artisan Burrata & Truffle Pizza",
    name_ar: "بيتزا البوراتا والترافل الإيطالية",
    description: "48-hour slow fermented dough, San Marzano tomato base, creamy whole Italian burrata, fresh black truffle shavings, basil.",
    description_ar: "عجينة مخمرة لمدة ٤٨ ساعة، صلصة طماطم سان مارزانو، جبنة بوراتا إيطالية كاملة، رقائق الترافل الأسود وريحان طازج.",
    product_type: "Food",
    base_price: 21.00,
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    is_available: true,
    is_featured: true,
    is_bestseller: false,
    is_new: true,
    is_vegetarian: true,
    is_spicy: false,
    ingredients: "Neapolitan dough, Burrata, Truffle oil, San Marzano tomatoes, Fresh basil",
    ingredients_ar: "عجينة نابولية، جبنة بوراتا، زيت ترافل، طماطم، ريحان",
    calories: 880,
    prep_time_mins: 14,
    display_order: 4,
    sizes: [
      { id: 7, name: "Medium 11 inch", name_ar: "وسط ١١ إنش", price: 21.00, is_default: true },
      { id: 8, name: "Large 14 inch", name_ar: "كبير ١٤ إنش", price: 27.50 }
    ],
    extras: [],
    images: []
  },
  {
    id: 5,
    category_id: 4,
    name: "Handmade Fettuccine Tartufo",
    name_ar: "فيتوتشيني تارتوفو بالمشروم والترافل",
    description: "Silky handcrafted egg fettuccine tossed in a rich Parmigiano-Reggiano emulsion, wild porcini mushrooms, and white truffle glaze.",
    description_ar: "فيتوتشيني طازجة محضرة يدوياً بالبيض، مع صوص جبن بارميجيانو كريمي، فطر البورتشيني البري ولمسة الترافل الأبيض.",
    product_type: "Food",
    base_price: 19.50,
    image_url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281728?auto=format&fit=crop&w=800&q=80",
    is_available: true,
    is_featured: false,
    is_bestseller: true,
    is_new: false,
    is_vegetarian: true,
    is_spicy: false,
    ingredients: "Egg fettuccine, Porcini mushrooms, Parmigiano-Reggiano, Cream, Truffle butter",
    ingredients_ar: "فيتوتشيني بيض، فطر بورتشيني، بارميزان، كريمة طازجة، زبدة ترافل",
    calories: 780,
    prep_time_mins: 15,
    display_order: 5,
    sizes: [
      { id: 9, name: "Regular Portion", name_ar: "طبق فردي", price: 19.50, is_default: true },
      { id: 10, name: "Large Sharing Plate", name_ar: "طبق للمشاركة", price: 26.00 }
    ],
    extras: [
      { id: 7, name: "Add Grilled Chicken Breast", name_ar: "إضافة صدر دجاج مشوي", price: 4.50, max_quantity: 1 }
    ],
    images: []
  },
  {
    id: 6,
    category_id: 5,
    name: "Crispy Golden Truffle Mac & Cheese Balls",
    name_ar: "كرات ماك آند تشيز المقرمشة بالترافل",
    description: "Crispy panko-breaded bites stuffed with four-cheese macaroni, black truffle essence, served with warm marinara dipping sauce.",
    description_ar: "لقيمات مقرمشة بفتات البانكو محشوة بمكرونة بأربعة أنواع أجبان فاخرة وخلاصة الترافل مع صوص المارينارا الساخن.",
    product_type: "Food",
    base_price: 11.00,
    discount_price: 9.50,
    image_url: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    is_available: true,
    is_featured: false,
    is_bestseller: false,
    is_new: true,
    is_vegetarian: true,
    is_spicy: false,
    ingredients: "Macaroni, 4 Cheeses, Panko, Truffle essence, Marinara sauce",
    ingredients_ar: "مكرونة، ٤ أنواع جبن، بانكو، نكهة الترافل، صوص مارينارا",
    calories: 520,
    prep_time_mins: 10,
    display_order: 6,
    sizes: [],
    extras: [],
    images: []
  },
  {
    id: 7,
    category_id: 6,
    name: "Molten Valrhona Lava Cake",
    name_ar: "مولتن لافا كيك شوكولاتة فالرونا",
    description: "Warm Belgian 70% dark chocolate fondant with a flowing gooey core, served with Madagascar vanilla bean gelato and fresh berries.",
    description_ar: "كيك شوكولاتة بلجيكية داكنة ٧٠٪ ساخنة بقلب يتدفق بالشوكولاتة الذائبة، تقدم مع آيس كريم فانيليا مدغشقر وتوت طازج.",
    product_type: "Desserts",
    base_price: 10.50,
    image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    is_available: true,
    is_featured: true,
    is_bestseller: true,
    is_new: false,
    is_vegetarian: true,
    is_spicy: false,
    ingredients: "Valrhona 70% dark chocolate, Pure butter, Eggs, Madagascar vanilla gelato, Berries",
    ingredients_ar: "شوكولاتة فالرونا ٧٠٪، زبدة نقية، بيض، آيس كريم فانيليا، توت بري",
    calories: 610,
    prep_time_mins: 12,
    display_order: 7,
    sizes: [],
    extras: [],
    images: []
  },
  {
    id: 8,
    category_id: 7,
    name: "Dragonfruit Passion Sparkler",
    name_ar: "عصير فاكهة التنين وباشن فروت المنعش",
    description: "Freshly squeezed red dragonfruit, passion fruit pulp, wild organic mint leaves, lime juice, topped with sparkling botanical soda.",
    description_ar: "فاكهة التنين الحمراء الطازجة المعصورة مع لب الباشن فروت، أوراق النعناع البري، عصير ليمون ومياه فوارة منعشة.",
    product_type: "Drinks",
    base_price: 7.50,
    image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    is_available: true,
    is_featured: true,
    is_bestseller: false,
    is_new: true,
    is_vegetarian: true,
    is_spicy: false,
    ingredients: "Red dragonfruit, Passion fruit, Fresh mint, Lime, Sparkling soda",
    ingredients_ar: "دراجون فروت أحمر، باشن فروت، نعناع طازج، ليمون، صودا فوارة",
    calories: 140,
    prep_time_mins: 5,
    display_order: 8,
    sizes: [
      { id: 11, name: "Regular Glass (400ml)", name_ar: "كوب عادي (٤٠٠مل)", price: 7.50, is_default: true },
      { id: 12, name: "Large Pitcher (1 Liter)", name_ar: "إبريق كبير (١ لتر)", price: 14.00 }
    ],
    extras: [],
    images: []
  }
];

export const mockCoupons: Coupon[] = [
  { id: 1, code: "WELCOME10", discount_percent: 10, min_order_value: 20, is_active: true, usage_count: 5 },
  { id: 2, code: "GOURMET20", discount_percent: 20, min_order_value: 50, is_active: true, usage_count: 12 },
  { id: 3, code: "SAVE5", discount_amount: 5, min_order_value: 25, is_active: true, usage_count: 8 }
];

export const mockReviews: Review[] = [
  { id: 1, customer_name: "Alexander Wright", rating: 5, comment: "The Wagyu Truffle burger was undoubtedly the best burger I've had all year. Fast delivery and packaging was premium!", created_at: "2026-11-09T18:30:00Z", is_approved: true },
  { id: 2, customer_name: "Layla Al-Mansour", rating: 5, comment: "تجربة طعام خيالية! البيتزا على الحطب طرية ولذيذة جداً وخدمة التوصيل سريعة ومحترمة.", created_at: "2026-11-10T14:15:00Z", is_approved: true },
  { id: 3, customer_name: "Marcus Chen", rating: 5, comment: "The 350g Ribeye with truffle mash was cooked to exact perfection. Definitely our new favorite weekend restaurant.", created_at: "2026-11-10T20:45:00Z", is_approved: true }
];

export const mockOrders: Order[] = [
  {
    id: 1,
    order_number: "ORD-20261111-92B104",
    customer_name: "Sarah Jenkins",
    customer_phone: "+1 555-019-2831",
    delivery_address: "742 Evergreen Terrace, Apt 4B",
    order_type: "delivery",
    payment_method: "cash_on_delivery",
    payment_status: "paid",
    status: "completed",
    subtotal: 52.99,
    delivery_fee: 4.99,
    discount_amount: 5.30,
    total: 57.18,
    coupon_code: "WELCOME10",
    created_at: "2026-11-11T12:30:00Z",
    items: [
      { id: 1, product_id: 1, product_name: "Truffle Wagyu Supreme Burger", size_name: "Single Patty (200g)", unit_price: 18.99, quantity: 2, total_price: 37.98 },
      { id: 2, product_id: 8, product_name: "Dragonfruit Passion Sparkler", size_name: "Regular Glass (400ml)", unit_price: 7.50, quantity: 2, total_price: 15.00 }
    ]
  },
  {
    id: 2,
    order_number: "ORD-20261111-47A812",
    customer_name: "Omar Al-Khatib",
    customer_phone: "+1 555-018-9941",
    table_number: "Table 6",
    order_type: "dine_in",
    payment_method: "online_card",
    payment_status: "paid",
    status: "preparing",
    subtotal: 34.00,
    delivery_fee: 0,
    discount_amount: 0,
    total: 36.89,
    created_at: "2026-11-11T14:10:00Z",
    items: [
      { id: 3, product_id: 3, product_name: "Ribeye Steak 350g with Herb Butter", size_name: "Medium Rare (Recommended)", unit_price: 34.00, quantity: 1, total_price: 34.00 }
    ]
  }
];

export const mockAdminUser: AdminUser = {
  id: 1,
  username: "admin",
  full_name: "Restaurant Administrator",
  email: "admin@gourmethaven.com",
  role: "superadmin"
};
