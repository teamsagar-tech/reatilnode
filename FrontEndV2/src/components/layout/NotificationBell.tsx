import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/notifications?limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data?.notifications || []);
            setUnreadCount(res.data?.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            setNotifications([]);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${apiUrl}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${apiUrl}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300 relative group"
            >
                <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'group-hover:animate-pulse text-slate-600' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 border-2 border-white text-[8px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Mark all read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-sm text-slate-500 font-medium">
                                No recent notifications
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    onClick={() => !notif.is_read && markAsRead(notif.id)}
                                    className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.is_read ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm ${!notif.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {notif.title}
                                        </h4>
                                        {!notif.is_read && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                                    <span className="text-[10px] font-medium text-slate-400 mt-2 block">
                                        {new Date(notif.created_at).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50">
                        <Link 
                            to="/notifications" 
                            onClick={() => setIsOpen(false)}
                            className="block w-full py-1.5 text-center text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
