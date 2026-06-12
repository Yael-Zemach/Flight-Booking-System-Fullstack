// src/Hooks/useSocketNotifications.jsx
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// 🌟 פתרון בעיית האודיו: מגדירים את האלמנטים פעם אחת מחוץ לקומפוננטה
const successSound = new Audio('/sounds/success.mp3');
const cancelSound = new Audio('/sounds/cancel.mp3');

export default function useSocketNotifications(isAdminLayout) {
  // הסטייט מנוהל פה בתוך ההוק
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAdminLayout) return;

    // התחברות לשרת הסוקטים
    const socket = io('http://localhost:3000');

    // פונקציית שמע אופטימלית שאינה מייצרת אובייקטים מחדש
    const playSound = (audioObj, volume) => {
      audioObj.volume = volume;
      audioObj.currentTime = 0; // מאפס את הסאונד להתחלה כדי שיוכל לנגן שוב ושוב באופן מיידי
      audioObj.play().catch(err => console.log("השמעת אודיו נחסמה על ידי הדפדפן", err));
    };

    // פונקציית עזר פנימית לקביעת טיימר מחיקה לבלון
    const createTimeout = (id) => {
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      }, 4000);
    };

    // 🚀 האזנה לאירועים בזמן אמת מהשרת
    socket.on('new_booking_created', (data) => {
      playSound(successSound, 0.5); // שימוש במופע הגלובלי הקבוע
      const id = Date.now();
      
      setNotifications(prev => [...prev, {
        id,
        type: 'success',
        title: `🚀 הזמנה חדשה שולמה! (#${data.bookingId})`,
      }]);
      
      createTimeout(id);
    });

    socket.on('booking_cancelled', (data) => {
      playSound(cancelSound, 0.4); // שימוש במופע הגלובלי הקבוע
      const id = Date.now();
      
      setNotifications(prev => [...prev, {
        id,
        type: 'cancel',
        title: `🛑 הזמנה בוטלה!`,
        text: `הזמנה מספר #${data.bookingId} בוטלה והוסרה מהמערכת.`
      }]);
      
      createTimeout(id);
    });

    // ניתוק הסוקט בעזיבת אזור האדמין
    return () => {
      socket.disconnect();
    };
  }, [isAdminLayout]);

  // פונקציה למחיקה ידנית בלחיצה על ה-X
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // ההוק מחזיר החוצה רק את מה שה-Layout צריך בשביל הרינדור
  return { notifications, removeNotification };
}