import axios from 'axios';

// Utility function to convert Base64 URL to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

// Replace this with process.env / VITE_ key in production
const PUBLIC_VAPID_KEY = 'BGu3NaIhIA-NmvR-NTGEOfTNZckLBaHzKRPONNFVYf98c-JMBQwICuPwyyvPGFg_mwFR4AzzZ1fQDedT0nUvsNU';

export const subscribeToWebPush = async (token) => {
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker is not supported in this browser.');
        return;
    }

    if (!('PushManager' in window)) {
        console.warn('Push API is not supported in this browser.');
        return;
    }

    try {
        // Register the Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');

        // Request Notification Permission
        const permission = await window.Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission denied');
            return;
        }

        // Subscribe to Push
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });

        // Send subscription to our backend
        const deviceInfo = navigator.userAgent;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.post(`${apiUrl}/api/notifications/subscribe`, {
            subscription,
            device_info: deviceInfo
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Successfully subscribed to RetailNode Web Push!');
    } catch (error) {
        console.error('Failed to subscribe to Web Push:', error);
    }
};
