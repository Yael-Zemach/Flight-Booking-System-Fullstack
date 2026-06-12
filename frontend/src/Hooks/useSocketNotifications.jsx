// src/Hooks/useSocketNotifications.jsx
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function useSocketNotifications(isAdminLayout) {
  // 🌟 הסטייט מנוהל פה בתוך ההוק
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAdminLayout) return;

    // התחברות לשרת הסוקטים
    const socket = io('http://localhost:3000');

    // פונקציות שמע מקומיות
    const playSound = (path, volume) => {
      const audio = new Audio(path);
      audio.volume = volume;
      audio.play().catch(err => console.log("השמעת אודיו נחסמה על ידי הדפדפן", err));
    };

    // פונקציית עזר פנימית לקביעת טיימר מחיקה לבלון
    const createTimeout = (id) => {
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      }, 4000);
    };

    // 🚀 האזנה לאירועים בזמן אמת מהשרת
    socket.on('new_booking_created', (data) => {
      playSound('/sounds/success.mp3', 0.5);
      const id = Date.now();
      
      setNotifications(prev => [...prev, {
        id,
        type: 'success',
        title: `🚀 הזמנה חדשה! (#${data.bookingId})`,
      }]);
      
      createTimeout(id);
    });

    socket.on('booking_cancelled', (data) => {
      playSound('/sounds/cancel.mp3', 0.4);
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

  // 🌟 ההוק מחזיר החוצה רק את מה שה-Layout צריך בשביל הרינדור
  return { notifications, removeNotification };
}