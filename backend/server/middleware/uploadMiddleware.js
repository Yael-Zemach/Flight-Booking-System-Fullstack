import multer from 'multer';
import path from 'path';

// 1. הגדרת מיקום השמירה ושם הקובץ
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // המקום בו יישמרו הקבצים הפיזיים בשרת (צריך ליצור תיקיית uploads בתוך השרת)
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // יוצר שם ייחודי: הזמן הנוכחי + סיומת הקובץ המקורית (.jpg, .png וכו')
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. סינון קבצים - לוודא שמעלים רק תמונות
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('מותר להעלות קבצי תמונה בלבד!'), false);
    }
};

// 3. ייצוא המידלוור המוכן
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // הגבלת גודל קובץ ל-5MB
});