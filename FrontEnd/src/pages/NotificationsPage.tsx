import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import axios from 'axios';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);

    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchNotifications = async (isLoadMore = false) => {
        try {
            const res = await axios.get(`${apiUrl}/api/notifications?limit=50&offset=${isLoadMore ? page * 50 : 0}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (isLoadMore) {
                setNotifications(prev => [...prev, ...(res.data?.notifications || [])]);
            } else {
                setNotifications(res.data?.notifications || []);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            if (!isLoadMore) setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: any) => {
        try {
            await axios.put(`${apiUrl}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${apiUrl}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    return (
        <div className="w-full px-4 py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Bell className="w-8 h-8 text-indigo-600" />
                        Notification Center
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">View your complete history of system alerts and messages.</p>
                </div>
                <button 
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                >
                    <Check className="w-4 h-4" /> Mark All as Read
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Bell className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
                        <p>You have no notifications in your history.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                            <div 
                                key={notif.id} 
                                className={`p-6 flex items-start gap-4 transition-colors ${!notif.is_read ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-base ${!notif.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {notif.title}
                                        </h4>
                                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400 shrink-0 ml-4">
                                            <Clock className="w-3 h-3" />
                                            {new Date(notif.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className={`mt-1 text-sm ${!notif.is_read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                        {notif.message}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 mt-3">
                                        {!notif.is_read && (
                                            <button 
                                                onClick={() => markAsRead(notif.id)}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        {notif.link_url && (
                                            <a 
                                                href={notif.link_url} 
                                                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3 h-3" /> View Details
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {!isLoading && notifications.length > 0 && (
                <div className="text-center mt-6">
                    <button 
                        onClick={() => {
                            setPage(p => p + 1);
                            fetchNotifications(true);
                        }}
                        className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        Load Older Notifications
                    </button>
                </div>
            )}
        </div>
    );
}
