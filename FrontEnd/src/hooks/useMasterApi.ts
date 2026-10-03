import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useMasterApi(urlPath: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchList = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/${urlPath}`;
      if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`;
      
      const res = await fetch(url, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error(`Failed to fetch ${urlPath}:`, error);
    } finally {
      setLoading(false);
    }
  }, [urlPath]);

  const saveRecord = async (payload: any, id?: string | number) => {
    try {
      // Auto-map legacy frontend keys to backend 'name' schema
      const finalPayload = { ...payload };
      if (!finalPayload.name) {
        const nameKey = Object.keys(finalPayload).find(k => k.toLowerCase().endsWith('name'));
        if (nameKey) finalPayload.name = finalPayload[nameKey];
        // fallback if no nameKey found but there's a title or something
        if (!finalPayload.name && Object.keys(finalPayload).length > 0) {
            finalPayload.name = finalPayload[Object.keys(finalPayload)[0]];
        }
      }

      const url = id 
        ? `${API_URL}/api/${urlPath}/${id}`
        : `${API_URL}/api/${urlPath}`;
      
      const res = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(finalPayload)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      
      await fetchList();
      return { success: true };
    } catch (error: any) {
      alert(error.message || 'Error saving record');
      return { success: false, error };
    }
  };

  return { data, loading, fetchList, saveRecord };
}
