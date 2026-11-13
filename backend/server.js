/**
 * ==============================================================================
 * DIGITAL RESTAURANT MENU & ADMIN DASHBOARD - BACKEND API SERVER
 * ==============================================================================
 * 
 * Architecture:
 * - Minimalist, lightweight Node.js + Express backend.
 * - Local-first persistent JSON storage in `backend/data/database.json`.
 * - Zero native C++ compilation required - runs anywhere out of the box.
 * - Complete CRUD endpoints for Categories & Menu Items with dynamic Sizes/Prices.
 * - Simple secure Admin Login gate (default password: "admin123").
 * - Image upload handler via Multer (stored in `backend/uploads/`).
 * 
 * HOW TO START THE SERVER:
 *   1. Open terminal inside the `backend` folder:
 *        cd backend
 *   2. Install dependencies (if not already done):
 *        npm install
 *   3. Start the server:
 *        npm start    (or `npm run dev` for auto-reloading)
 *   4. The server runs at: http://localhost:5000
 * 
 * HOW TO ACCESS THE ADMIN DASHBOARD:
 *   - In the frontend public menu, click the "لوحة الإدارة / Admin" button in the header,
 *     or click "تغيير الصورة / تعديل الصورة" on any category card.
 *   - Enter the Admin password: admin123
 *   - You can manage categories, items, sizes, prices, and upload images.
 * ==============================================================================
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// -----------------------------------------------------------------------------
// Middleware Configuration
// -----------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data & upload directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// -----------------------------------------------------------------------------
// File Upload Configuration (Multer)
// -----------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// -----------------------------------------------------------------------------
// Persistent Database Handler (Local-first JSON file storage)
// -----------------------------------------------------------------------------
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default seed data tailored to the restaurant menu in the prompt image
const SEED_DATA = {
  restaurant: {
    name: 'مطعم وكافيه خطاب',
    name_en: 'Khatab Restaurant & Café',
    currency: 'EGP',
    currency_symbol: 'ج.م',
    tagline: 'أشهى المأكولات والمشويات الشرقية والغربية في قلب القاهرة',
    phone: '+20 100 234 5678',
    address: 'شارع 26 يوليو، الزمالك، القاهرة'
  },
  categories: [
    {
      id: 'cat-grills',
      name: 'مشويات ولحوم',
      name_en: 'Grilled Meats & BBQ',
      icon: '🥩',
      image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      description: 'مشويات لحوم، كباب وكفتة حاتي وشيش طاووق على الفحم',
      sort_order: 1
    },
    {
      id: 'cat-burgers',
      name: 'برجر وسندوتشات',
      name_en: 'Burgers & Sandwiches',
      icon: '🍔',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: 'برجر بقري فاخر، دبل تشيز وتشيكن كريسبي مع صوصات خاصة',
      sort_order: 2
    },
    {
      id: 'cat-pizza',
      name: 'بيتزا وفطائر',
      name_en: 'Pizza & Pies',
      icon: '🍕',
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      description: 'بيتزا إيطالية على الحطب، مارجريتا، ببيروني وموتزاريلا طبيعية',
      sort_order: 3
    },
    {
      id: 'cat-mains',
      name: 'وجبات رئيسية',
      name_en: 'Main Courses',
      icon: '🍗',
      image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
      description: 'وجبات عائلية متكاملة، دجاج شواية وأرز بسمتي بالخلطة والمكسرات',
      sort_order: 4
    },
    {
      id: 'cat-starters',
      name: 'مقبلات وبطاطس',
      name_en: 'Appetizers & Sides',
      icon: '🍟',
      image_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
      description: 'بطاطس مبهّرة، أصابع جبنة موتزاريلا مقلية، سمبوسك وسلطات شرقية',
      sort_order: 5
    },
    {
      id: 'cat-drinks',
      name: 'مشروبات وعصائر',
      name_en: 'Drinks & Juices',
      icon: '🥤',
      image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      description: 'عصائر طبيعية طازجة، موهيتو منعش، ومشروبات باردة',
      sort_order: 6
    },
    {
      id: 'cat-desserts',
      name: 'حلويات وكافيه',
      name_en: 'Desserts & Café',
      icon: '🍰',
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      description: 'أم علي بالقشطة والمكسرات، تشيز كيك، وقهوة إسبريسو مختصة',
      sort_order: 7
    }
  ],
  items: [
    // 1. Grills
    {
      id: 'item-101',
      category_id: 'cat-grills',
      name: 'مشكل مشويات حاتي فاخر',
      name_en: 'Khatab Mixed Grill Platter',
      description: 'كباب بتلو، كفتة حاتي مشوية، وشيش طاووق مع خبز بلدي وطحينة',
      image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'ربع كيلو (فردي)', name_en: 'Single (250g)', price: 185 },
        { name: 'نصف كيلو (وسط)', name_en: 'Medium (500g)', price: 340 },
        { name: 'كيلو كامل (عائلي)', name_en: 'Full Kg (Family)', price: 650 }
      ]
    },
    {
      id: 'item-102',
      category_id: 'cat-grills',
      name: 'كفتة حاتي بلدي على الفحم',
      name_en: 'Charcoal Grilled Kofta',
      description: 'كفتة لحم بلدي طازجة بتتبيلة خطاب السرية مع أرز بسمتي وسلطة خضراء',
      image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'طبق فردي', name_en: 'Small', price: 140 },
        { name: 'نصف كيلو', name_en: 'Medium', price: 260 },
        { name: 'كيلو عائلي', name_en: 'Large', price: 490 }
      ]
    },
    {
      id: 'item-103',
      category_id: 'cat-grills',
      name: 'شيش طاووق متبل بالزبادي والأعشاب',
      name_en: 'Marinated Shish Tawook',
      description: 'قطع أوراك دجاج مخلية متبلة ومشوية على السيخ مع فلفل وبصل مشوي',
      image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'وجبة صغيرة', name_en: 'Small', price: 130 },
        { name: 'وجبة وسط', name_en: 'Medium', price: 210 },
        { name: 'وجبة عائلية', name_en: 'Large', price: 380 }
      ]
    },
    {
      id: 'item-104',
      category_id: 'cat-grills',
      name: 'ريش ضاني مشوية',
      name_en: 'Grilled Lamb Chops',
      description: 'ريش ضاني متبلة بأعشاب الجبل ومطبوخة بعناية على الفحم',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'نصف كيلو', name_en: 'Medium', price: 420 },
        { name: 'كيلو كامل', name_en: 'Large', price: 790 }
      ]
    },
    {
      id: 'item-105',
      category_id: 'cat-grills',
      name: 'طرب لحم بلدي مخصوص',
      name_en: 'Traditional Tarb',
      description: 'كفتة مشوية ملفوفة بمنديل الضاني المقرمش الشهير',
      image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'طبق فردي', name_en: 'Small', price: 160 },
        { name: 'نصف كيلو', name_en: 'Medium', price: 295 },
        { name: 'كيلو عائلي', name_en: 'Large', price: 560 }
      ]
    },
    {
      id: 'item-106',
      category_id: 'cat-grills',
      name: 'حواوشي حاتي إسكندراني بالجبنة',
      name_en: 'Stuffed Hawawshi with Mozzarella',
      description: 'خبز بلدي مقرمش محشو باللحم البلدي المتبل والجبنة الموتزاريلا الذائبة',
      image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'رغيف عادي', name_en: 'Regular', price: 65 },
        { name: 'رغيف دبل لحم وجبنة', name_en: 'Double Meat & Cheese', price: 95 }
      ]
    },

    // 2. Burgers
    {
      id: 'item-201',
      category_id: 'cat-burgers',
      name: 'كلاسيك سموك هاوس برجر',
      name_en: 'Smokehouse Classic Burger',
      description: 'قطعة برجر بقري أنجوس 180 جم مع صوص الباربكيو المدخن وشيدر معتقة',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'سينجل (150 جم)', name_en: 'Single', price: 125 },
        { name: 'دبل (300 جم)', name_en: 'Double', price: 175 },
        { name: 'تريبل (450 جم)', name_en: 'Triple', price: 225 }
      ]
    },
    {
      id: 'item-202',
      category_id: 'cat-burgers',
      name: 'ديلوكس مشروم آند سويس برجر',
      name_en: 'Mushroom & Swiss Burger',
      description: 'برجر بقري طازج مع مشروم سوتيه كريمي وجبنة سويسرية ذائبة',
      image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'حجم عادي', name_en: 'Single', price: 135 },
        { name: 'حجم دبل', name_en: 'Double', price: 185 }
      ]
    },
    {
      id: 'item-203',
      category_id: 'cat-burgers',
      name: 'سوبر كريسبي تشيكن زنجر',
      name_en: 'Super Crispy Chicken Zinger',
      description: 'صدر دجاج مقرمش متبل بخلطة حارة مع كول سلو وصوص تشيزي رانش',
      image_url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'عادي (Regular)', name_en: 'Regular', price: 110 },
        { name: 'وجبة كومبو (مع بطاطس ومشروب)', name_en: 'Combo Meal', price: 155 }
      ]
    },
    {
      id: 'item-204',
      category_id: 'cat-burgers',
      name: 'سندوتش كفتة حاتي بالخبز البلدي',
      name_en: 'Egyptian Kofta Roll',
      description: 'أصابع كفتة حاتي مشوية في خبز ساخن مع طحينة وخضروات مخللة',
      image_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'سندوتش فردي', name_en: 'Single', price: 55 },
        { name: 'سندوتش دبل', name_en: 'Double', price: 85 }
      ]
    },
    {
      id: 'item-205',
      category_id: 'cat-burgers',
      name: 'سندوتش كبدة إسكندراني سبيشال',
      name_en: 'Alexandrian Liver Sandwich',
      description: 'كبدة بلدي متبلة بالثوم والفلفل الحار والليمون بالطريقة الإسكندرانية الأصلية',
      image_url: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'سندوتش عادي', name_en: 'Regular', price: 50 },
        { name: 'سندوتش جامبو', name_en: 'Jumbo', price: 75 }
      ]
    },

    // 3. Pizza
    {
      id: 'item-301',
      category_id: 'cat-pizza',
      name: 'بيتزا ببيروني إيطالي كلاسيك',
      name_en: 'Pepperoni Classic Pizza',
      description: 'صلصة طماطم سان مارزانو، موتزاريلا إيطالية طبيعية وشرائح ببيروني مقرمشة',
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'صغير (22 سم)', name_en: 'Small (22cm)', price: 120 },
        { name: 'وسط (28 سم)', name_en: 'Medium (28cm)', price: 175 },
        { name: 'كبير (35 سم)', name_en: 'Large (35cm)', price: 235 }
      ]
    },
    {
      id: 'item-302',
      category_id: 'cat-pizza',
      name: 'بيتزا فور تشيز (أربعة أجبان)',
      name_en: 'Quattro Formaggi Pizza',
      description: 'مزيج فاخر من الموتزاريلا، البارميزان، الريكوتا والجبنة الزرقاء جورجونزولا',
      image_url: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'صغير (22 سم)', name_en: 'Small', price: 130 },
        { name: 'وسط (28 سم)', name_en: 'Medium', price: 185 },
        { name: 'كبير (35 سم)', name_en: 'Large', price: 250 }
      ]
    },
    {
      id: 'item-303',
      category_id: 'cat-pizza',
      name: 'بيتزا باربكيو تشيكن',
      name_en: 'BBQ Chicken Pizza',
      description: 'قطع دجاج مشوية بصوص الباربكيو، بصل أحمر مكرمل، فلفل ألوان وجبنة موتزاريلا',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'صغير', name_en: 'Small', price: 125 },
        { name: 'وسط', name_en: 'Medium', price: 180 },
        { name: 'كبير', name_en: 'Large', price: 245 }
      ]
    },
    {
      id: 'item-304',
      category_id: 'cat-pizza',
      name: 'فطيرة سجق بلدي إسكندراني كيري',
      name_en: 'Alexandrian Sausage Pie with Kiri',
      description: 'فطير شرقي مورق بالسمن البلدي محشو بسجق إسكندراني وجبنة كيري وموتزاريلا',
      image_url: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'وسط', name_en: 'Medium', price: 165 },
        { name: 'كبير عائلي', name_en: 'Large', price: 230 }
      ]
    },
    {
      id: 'item-305',
      category_id: 'cat-pizza',
      name: 'فطيرة مشكل لحوم شرقية',
      name_en: 'Eastern Meat Lovers Pie',
      description: 'لحم مفروم، بسطرمة، سجق، زيتون، فلفل ألوان وموتزاريلا مطاطية',
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'وسط', name_en: 'Medium', price: 175 },
        { name: 'كبير عائلي', name_en: 'Large', price: 245 }
      ]
    },

    // 4. Main Courses
    {
      id: 'item-401',
      category_id: 'cat-mains',
      name: 'دجاج شواية على الفحم مع أرز بالخلطة',
      name_en: 'Charcoal Roasted Chicken Platter',
      description: 'دجاجة طازجة مشوية بتتبيلة الأعشاب مع أرز بسمتي بالخلطة والمكسرات وسلطات',
      image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'نصف دجاجة (فردي)', name_en: 'Half Chicken', price: 135 },
        { name: 'دجاجة كاملة (عائلي)', name_en: 'Whole Chicken', price: 245 }
      ]
    },
    {
      id: 'item-402',
      category_id: 'cat-mains',
      name: 'طاجن لحمة موزة بالبصل القاورما',
      name_en: 'Braised Beef Shank Tagine',
      description: 'لحم موزة بتلو مطهو على نار هادئة في طاجن فخار مع البصل المكرمل وتوابل خطاب',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'طاجن وسط', name_en: 'Medium', price: 220 },
        { name: 'طاجن كبير لشخصين', name_en: 'Large', price: 340 }
      ]
    },
    {
      id: 'item-403',
      category_id: 'cat-mains',
      name: 'فتة لحمة كوارع وموزة مصرية',
      name_en: 'Traditional Egyptian Fatta',
      description: 'خبز بلدي محمص، أرز مصري بالزبدة، صلصة الخل والثوم وقطع لحم بتلو دايبة',
      image_url: 'https://images.unsplash.com/photo-1547928576-965beec56488?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'طبق فردي', name_en: 'Single', price: 175 },
        { name: 'سرفيس عائلي', name_en: 'Family', price: 320 }
      ]
    },
    {
      id: 'item-404',
      category_id: 'cat-mains',
      name: 'وجبة كريسبي استربس عائلية',
      name_en: 'Family Crispy Chicken Strips',
      description: 'قطع صدور دجاج كرانشي ذهبية مع أرز ريزو، بطاطس مقلية، كول سلو وصوصات',
      image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'وجبة 5 قطع', name_en: '5 Pieces', price: 140 },
        { name: 'وجبة 10 قطع', name_en: '10 Pieces', price: 260 },
        { name: 'سطل عائلي 18 قطعة', name_en: 'Family Bucket 18 Pcs', price: 420 }
      ]
    },

    // 5. Starters
    {
      id: 'item-501',
      category_id: 'cat-starters',
      name: 'بطاطس ودجز مبهّرة مقرمشة',
      name_en: 'Seasoned Potato Wedges',
      description: 'أصابع بطاطس مقرمشة متبلة بخلطة البابريكا والأوريجانو مع صوص شيدر',
      image_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'حجم عادي', name_en: 'Regular', price: 45 },
        { name: 'حجم عائلي', name_en: 'Large', price: 75 }
      ]
    },
    {
      id: 'item-502',
      category_id: 'cat-starters',
      name: 'أصابع جبنة موتزاريلا مقلية',
      name_en: 'Crispy Mozzarella Sticks',
      description: 'أصابع موتزاريلا مقلية ذهبية مع صوص المارينارا الإيطالي',
      image_url: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: '4 قطع', name_en: '4 Pcs', price: 65 },
        { name: '8 قطع', name_en: '8 Pcs', price: 115 }
      ]
    },

    // 6. Drinks
    {
      id: 'item-601',
      category_id: 'cat-drinks',
      name: 'عصير مانجو طبيعي فريش',
      name_en: 'Fresh Mango Juice',
      description: 'عصير مانجو طبيعي 100% بدون أي مواد حافظة أو سكر إضافي',
      image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'كوب وسط (350 مل)', name_en: 'Medium (350ml)', price: 45 },
        { name: 'كوب كبير (500 مل)', name_en: 'Large (500ml)', price: 65 }
      ]
    },
    {
      id: 'item-602',
      category_id: 'cat-drinks',
      name: 'موهيتو ليمون ونعناع منعش',
      name_en: 'Lemon Mint Mojito',
      description: 'ليمون طازج مع أوراق النعناع والصودا وقطع الثلج المجروش',
      image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'كأس عادي', name_en: 'Regular', price: 50 },
        { name: 'كأس جامبو', name_en: 'Jumbo', price: 70 }
      ]
    },

    // 7. Desserts
    {
      id: 'item-701',
      category_id: 'cat-desserts',
      name: 'طاجن أم علي ملوكي بالمكسرات والقشطة',
      name_en: 'Royal Om Ali with Nuts',
      description: 'رقائق ميل فوي بالحليب الساخن والمكسرات المحمصة وقشطة بلدي طازجة',
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      is_available: true,
      sizes: [
        { name: 'طاجن فردي', name_en: 'Single', price: 65 },
        { name: 'طاجن عائلي للمشاركة', name_en: 'Family Platter', price: 120 }
      ]
    }
  ]
};

// Helper: Read database from file (or initialize with seed)
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(SEED_DATA);
      return SEED_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading database file, using seed data:', error);
    return SEED_DATA;
  }
}

// Helper: Atomically write database to file
function writeDB(data) {
  try {
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}

// -----------------------------------------------------------------------------
// PUBLIC REST API ENDPOINTS
// -----------------------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Restaurant Menu API',
    version: '1.0.0'
  });
});

// Get restaurant settings
app.get('/api/settings', (_req, res) => {
  const db = readDB();
  res.json(db.restaurant || SEED_DATA.restaurant);
});

// Update restaurant settings (Admin)
app.put('/api/settings', (req, res) => {
  const db = readDB();
  db.restaurant = { ...db.restaurant, ...req.body };
  writeDB(db);
  res.json({ success: true, restaurant: db.restaurant });
});

// -----------------------------------------------------------------------------
// CATEGORIES CRUD ENDPOINTS
// -----------------------------------------------------------------------------

// GET all categories (with dynamically calculated item count)
app.get('/api/categories', (_req, res) => {
  const db = readDB();
  const categories = (db.categories || []).map(cat => {
    const itemCount = (db.items || []).filter(item => item.category_id === cat.id).length;
    return {
      ...cat,
      item_count: itemCount
    };
  });
  // Sort by sort_order
  categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  res.json(categories);
});

// POST create category
app.post('/api/categories', (req, res) => {
  const { name, name_en, icon, image_url, description, sort_order } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const db = readDB();
  const id = `cat-${Date.now()}`;
  const newCat = {
    id,
    name,
    name_en: name_en || name,
    icon: icon || '🍽️',
    image_url: image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: description || '',
    sort_order: sort_order !== undefined ? Number(sort_order) : (db.categories?.length || 0) + 1
  };

  db.categories = db.categories || [];
  db.categories.push(newCat);
  writeDB(db);

  res.status(201).json({ ...newCat, item_count: 0 });
});

// PUT update category (e.g. name, image_url, icon, description)
app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = (db.categories || []).findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const current = db.categories[index];
  const updated = {
    ...current,
    ...req.body,
    id // Ensure ID remains immutable
  };

  db.categories[index] = updated;
  writeDB(db);

  const itemCount = (db.items || []).filter(item => item.category_id === id).length;
  res.json({ ...updated, item_count: itemCount });
});

// DELETE category and optionally its items
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = (db.categories || []).length;

  db.categories = (db.categories || []).filter(c => c.id !== id);
  // Also remove associated items to prevent orphans
  db.items = (db.items || []).filter(item => item.category_id !== id);

  if (db.categories.length === initialLength) {
    return res.status(404).json({ error: 'Category not found' });
  }

  writeDB(db);
  res.json({ success: true, message: 'Category and associated items deleted successfully' });
});

// -----------------------------------------------------------------------------
// ITEMS CRUD ENDPOINTS (with dynamic Sizes & Prices)
// -----------------------------------------------------------------------------

// GET all items (optional ?category_id=...)
app.get('/api/items', (req, res) => {
  const db = readDB();
  const { category_id } = req.query;

  let items = db.items || [];
  if (category_id) {
    items = items.filter(item => item.category_id === category_id);
  }

  res.json(items);
});

// POST create menu item
app.post('/api/items', (req, res) => {
  const { name, name_en, category_id, description, image_url, sizes, is_available } = req.body;

  if (!name || !category_id) {
    return res.status(400).json({ error: 'Item name and category assignment are required' });
  }

  const db = readDB();
  const id = `item-${Date.now()}`;

  // Default sizes if none provided
  const parsedSizes = Array.isArray(sizes) && sizes.length > 0
    ? sizes.map(s => ({
        name: s.name || 'حجم عادي',
        name_en: s.name_en || 'Regular',
        price: Number(s.price || 0)
      }))
    : [{ name: 'حجم عادي', name_en: 'Regular', price: 100 }];

  const newItem = {
    id,
    category_id,
    name,
    name_en: name_en || name,
    description: description || '',
    image_url: image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    is_available: is_available !== undefined ? Boolean(is_available) : true,
    sizes: parsedSizes
  };

  db.items = db.items || [];
  db.items.push(newItem);
  writeDB(db);

  res.status(201).json(newItem);
});

// PUT update menu item
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = (db.items || []).findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const current = db.items[index];
  const { sizes, ...rest } = req.body;

  const updated = {
    ...current,
    ...rest,
    id
  };

  if (Array.isArray(sizes)) {
    updated.sizes = sizes.map(s => ({
      name: s.name || 'عادي',
      name_en: s.name_en || 'Regular',
      price: Number(s.price || 0)
    }));
  }

  db.items[index] = updated;
  writeDB(db);

  res.json(updated);
});

// DELETE menu item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = (db.items || []).length;

  db.items = (db.items || []).filter(item => item.id !== id);

  if (db.items.length === initialLength) {
    return res.status(404).json({ error: 'Item not found' });
  }

  writeDB(db);
  res.json({ success: true, message: 'Item deleted successfully' });
});

// -----------------------------------------------------------------------------
// ADMIN LOGIN AUTHENTICATION GATE
// -----------------------------------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === ADMIN_PASSWORD) {
    // Generate a simple secure token for SPA session
    const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    return res.json({
      success: true,
      token,
      message: 'Admin authentication successful',
      user: { role: 'admin', username: 'khatab_admin' }
    });
  }

  return res.status(401).json({ error: 'كلمة المرور غير صحيحة / Invalid admin password' });
});

// -----------------------------------------------------------------------------
// IMAGE UPLOAD ENDPOINT
// -----------------------------------------------------------------------------
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: publicUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

// -----------------------------------------------------------------------------
// START SERVER
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Restaurant Menu API Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔑 Admin Password: ${ADMIN_PASSWORD}`);
  console.log(`📂 Database File: ${DB_FILE}`);
  console.log(`==================================================\n`);
});
