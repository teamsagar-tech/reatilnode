import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Edit2, Merge, Trash2, X } from 'lucide-react';

// --- Edit Modal Component ---
const EditModal = ({ isOpen, item, type, departments, categories, onClose, onSave }: any) => {
  const [name, setName] = useState('');
  const [defaultCut, setDefaultCut] = useState('');
  const [itemType, setItemType] = useState('category'); // 'category' or 'subcategory'
  const [parentId, setParentId] = useState<number | string>('');
  const [deptId, setDeptId] = useState<number | string>('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && item) {
      setName(item.name);
      setDefaultCut(item.default_cut ? String(item.default_cut) : '');
      if (type === 0) {
        setItemType('department');
      } else if (type === 1) {
        setItemType('category');
        setDeptId(item.department_id || '');
      } else {
        setItemType('subcategory');
        setParentId(item.parent_id || '');
      }
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen, item]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && e.ctrlKey) handleSave(); // Ctrl+Enter to save
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const payload: any = { name: name.trim() };
    
    if (type !== 0) {
      payload.default_cut = defaultCut ? parseFloat(defaultCut) : null;
      if (itemType === 'category') {
        payload.department_id = deptId;
        payload.parent_id = null;
      } else {
        payload.parent_id = parentId;
      }
    }
    
    onSave(item.id, type, payload);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-2xl shadow-2xl w-[450px] flex flex-col font-sans overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
              <Edit2 className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Edit / Move {type === 0 ? 'Department' : type === 1 ? 'Category' : 'SubCategory'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4 text-xs font-semibold text-slate-600">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</label>
            <input 
              ref={nameInputRef}
              value={name} 
              onChange={(e) => setName(e.target.value.toUpperCase())} 
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all uppercase"
              placeholder="Enter name"
            />
          </div>

          {type !== 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Cut (Quantity)</label>
              <input 
                type="number"
                step="0.01"
                value={defaultCut} 
                onChange={(e) => setDefaultCut(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all uppercase"
                placeholder="e.g. 1.20 or 3.00 (optional)"
              />
            </div>
          )}

          {type !== 0 && (
            <>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hierarchy Level</label>
                <div className="flex gap-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="itemType" 
                      checked={itemType === 'category'} 
                      onChange={() => setItemType('category')}
                      className="accent-indigo-600 w-4 h-4" 
                    /> 
                    <span className="group-hover:text-indigo-600 transition-colors">Category</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="itemType" 
                      checked={itemType === 'subcategory'} 
                      onChange={() => setItemType('subcategory')}
                      className="accent-indigo-600 w-4 h-4"
                    /> 
                    <span className="group-hover:text-indigo-600 transition-colors">Sub Category</span>
                  </label>
                </div>
              </div>

              {itemType === 'category' ? (
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Belongs To Department</label>
                  <select 
                    value={deptId}
                    onChange={e => setDeptId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all uppercase"
                  >
                    <option value="">-- SELECT DEPARTMENT --</option>
                    {departments.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Belongs To Category</label>
                  <select 
                    value={parentId}
                    onChange={e => setParentId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all uppercase"
                  >
                    <option value="">-- SELECT PARENT CATEGORY --</option>
                    {categories.filter((c:any) => !c.parent_id).map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="bg-slate-50/80 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 font-bold rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-xs">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-xs">
            Save Changes <span className="opacity-70 font-normal ml-1">(Ctrl+Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Merge Modal Component ---
const MergeModal = ({ isOpen, sourceItem, type, categories, subCategories, onClose, onMerge }: any) => {
  const [targetId, setTargetId] = useState<number | string>('');
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => selectRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && e.ctrlKey) handleSave();
  };

  const handleSave = async () => {
    if (!targetId) return;
    onMerge(sourceItem.id, targetId);
  };

  if (!isOpen || !sourceItem) return null;

  const typeName = type === 1 ? 'Category' : 'SubCategory';
  const availableTargets = (type === 1 ? categories : subCategories).filter((c: any) => c.id !== sourceItem.id);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-2xl shadow-2xl w-[450px] flex flex-col font-sans overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="bg-rose-50 border-b border-rose-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
              <Merge className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-rose-800 text-sm uppercase tracking-wide">
              Merge {typeName}
            </h2>
          </div>
          <button onClick={onClose} className="text-rose-400 hover:text-rose-600 hover:bg-rose-100 p-1 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-5 text-xs font-semibold text-slate-600">
          <div className="bg-rose-50 text-rose-700 border border-rose-200 p-4 rounded-xl leading-relaxed">
            <strong className="text-rose-800 block mb-1">⚠️ MERGE WARNING</strong>
            You are about to merge <span className="font-bold bg-white px-1.5 py-0.5 rounded text-rose-900 shadow-sm mx-1">{sourceItem.name}</span>. 
            This will permanently delete it and migrate all its associated items to the target {typeName}.
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Target {typeName}:</label>
            <select 
              ref={selectRef}
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-800 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all uppercase"
            >
              <option value="">-- SELECT TARGET --</option>
              {availableTargets.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bg-slate-50/80 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 font-bold rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-xs">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!targetId} className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg shadow-md shadow-rose-200 hover:bg-rose-700 hover:-translate-y-0.5 transition-all text-xs disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed">
            Confirm Merge <span className="opacity-70 font-normal ml-1">(Ctrl+Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Taxonomy Page ---
export default function TaxonomyMaster() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);

  const [newDeptName, setNewDeptName] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newSubCatName, setNewSubCatName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Keyboard navigation state
  const [focusedCol, setFocusedCol] = useState(0);
  const [focusedIdx, setFocusedIdx] = useState(0);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<any>(null);
  const [modalType, setModalType] = useState<number>(0); // 0=dept, 1=cat, 2=subcat

  // Refs for inputs
  const inputDeptRef = useRef<HTMLInputElement>(null);
  const inputCatRef = useRef<HTMLInputElement>(null);
  const inputSubCatRef = useRef<HTMLInputElement>(null);

  const fetchDepartments = async () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/departments`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setDepartments(Array.isArray(data) ? data : []))
    .catch(console.error);
  };

  const fetchCategories = async () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setCategories(Array.isArray(data) ? data : []))
    .catch(console.error);
  };

  useEffect(() => {
    fetchDepartments();
    fetchCategories();
  }, []);

  const mainCategories = categories.filter(c => !c.parent_id);
  const subCategories = categories.filter(c => c.parent_id);

  const displayedCategories = mainCategories.filter(c => c.department_id === selectedDeptId);
  const displayedSubCategories = subCategories.filter(c => c.parent_id === selectedCatId);

  // Global Keydown for Navigation
  useEffect(() => {
    const handleGlobalKeyDown = async (e: KeyboardEvent) => {
      if (isModalOpen || isMergeModalOpen) return;
      if (document.activeElement?.tagName === 'INPUT') return; // let user type

      const currentList = focusedCol === 0 ? departments : focusedCol === 1 ? displayedCategories : displayedSubCategories;
      const maxIdx = currentList.length;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIdx(prev => Math.min(prev + 1, maxIdx));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIdx(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (focusedCol < 2) {
          if (focusedCol === 0 && !selectedDeptId) return;
          if (focusedCol === 1 && !selectedCatId) return;
          setFocusedCol(prev => prev + 1);
          setFocusedIdx(0);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (focusedCol > 0) {
          setFocusedCol(prev => prev - 1);
          setFocusedIdx(0);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedIdx < maxIdx) {
          const item = currentList[focusedIdx];
          if (focusedCol === 0) {
            setSelectedDeptId(item.id);
            setSelectedCatId(null);
          } else if (focusedCol === 1) {
            setSelectedCatId(item.id);
          }
        } else {
          if (focusedCol === 0) inputDeptRef.current?.focus();
          if (focusedCol === 1) inputCatRef.current?.focus();
          if (focusedCol === 2) inputSubCatRef.current?.focus();
        }
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (focusedIdx < maxIdx) {
          setModalItem(currentList[focusedIdx]);
          setModalType(focusedCol);
          setIsModalOpen(true);
        }
      } else if (e.key === 'F6') {
        e.preventDefault();
        if (focusedIdx < maxIdx && focusedCol > 0) { 
          setModalItem(currentList[focusedIdx]);
          setModalType(focusedCol);
          setIsMergeModalOpen(true);
        }
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (focusedIdx < maxIdx) {
          const item = currentList[focusedIdx];
          handleDelete(item, focusedCol);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/dashboard');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [focusedCol, focusedIdx, departments, displayedCategories, displayedSubCategories, selectedDeptId, selectedCatId, isModalOpen, isMergeModalOpen]);


  const handleAdd = async (url: string, payload: any, onSuccess: (data:any) => void) => {
    setErrorMsg('');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
      } else {
        setErrorMsg(data.error || 'Failed to add item');
      }
    } catch (err) {
      setErrorMsg('Network error');
    }
  };

  const handleUpdate = async (id: number, type: number, payload: any) => {
    const url = type === 0 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/departments/${id}`
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category/${id}`;
      
    setErrorMsg('');
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        if (type === 0) fetchDepartments();
        else fetchCategories();
      } else {
        alert(data.error || 'Failed to update item');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDelete = async (item: any, type: number) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return;
    const url = type === 0 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/departments/${item.id}`
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category/${item.id}`;
      
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        if (type === 0) fetchDepartments();
        else fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleMerge = async (sourceId: number, targetId: number) => {
    setErrorMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ source_id: sourceId, target_id: targetId })
      });
      const data = await res.json();
      if (res.ok) {
        setIsMergeModalOpen(false);
        fetchCategories();
      } else {
        alert(data.error || 'Failed to merge');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Taxonomy Master | RetailNode ERP</title>
      </Helmet>
      
      <EditModal 
        isOpen={isModalOpen}
        item={modalItem}
        type={modalType}
        departments={departments}
        categories={mainCategories}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdate}
      />
      
      <MergeModal 
        isOpen={isMergeModalOpen}
        sourceItem={modalItem}
        type={modalType}
        categories={mainCategories}
        subCategories={subCategories}
        onClose={() => setIsMergeModalOpen(false)}
        onMerge={handleMerge}
      />

      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full px-2 pt-2 pb-4'>
        <div className='flex flex-1 gap-4 overflow-hidden'>
          
          {/* Main Container */}
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300'>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
              <div className="flex items-end gap-3 shrink-0">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Taxonomy Master</h1>
                <span className="text-slate-300 font-light mb-1">|</span>
                <p className="text-sm font-medium text-slate-500">Configure Hierarchy</p>
              </div>
              
              <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="flex items-center gap-1.5"><span className="bg-white border border-slate-200 text-indigo-600 px-1.5 py-0.5 rounded shadow-sm">F4</span> Edit</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1.5"><span className="bg-white border border-slate-200 text-amber-600 px-1.5 py-0.5 rounded shadow-sm">F6</span> Merge</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1.5"><span className="bg-white border border-slate-200 text-rose-600 px-1.5 py-0.5 rounded shadow-sm">DEL</span> Delete</span>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 text-rose-700 border-l-4 border-rose-500 px-4 py-3 text-xs font-bold mx-5 mt-4 rounded-r-lg shadow-sm">
                {errorMsg}
              </div>
            )}
            
            {/* 3 Column Grid */}
            <div className='p-4 sm:p-5 flex-1 overflow-hidden flex gap-4 bg-slate-50/50'>
              
              {/* Column 1: Departments */}
              <div className={`flex-1 bg-white border rounded-2xl flex flex-col shadow-sm overflow-hidden transition-all duration-300 ${focusedCol === 0 ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
                <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-widest flex items-center justify-between">
                  Departments
                  <span className="bg-white border border-slate-200 text-slate-600 rounded-full px-2 py-0.5 text-[10px] shadow-sm">{departments.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1.5">
                  {departments.map((dept, idx) => {
                    const isSelected = selectedDeptId === dept.id;
                    const isFocused = focusedCol === 0 && focusedIdx === idx;
                    return (
                      <div 
                        key={dept.id} 
                        onClick={async () => { setSelectedDeptId(dept.id); setSelectedCatId(null); setFocusedCol(0); setFocusedIdx(idx); }}
                        className={`px-3 py-2.5 rounded-xl cursor-pointer font-bold text-xs border transition-all flex items-center justify-between ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 
                          isFocused ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {dept.name}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      </div>
                    );
                  })}
                </div>
                <div className={`p-3 bg-slate-50/50 border-t border-slate-100 ${focusedCol === 0 && focusedIdx === departments.length ? 'bg-indigo-50/50' : ''}`}>
                  <input 
                    ref={inputDeptRef}
                    type="text"
                    value={newDeptName}
                    onChange={e => setNewDeptName(e.target.value)}
                    onFocus={() => { setFocusedCol(0); setFocusedIdx(departments.length); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newDeptName.trim()) {
                        handleAdd(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/departments`, { name: newDeptName.trim(), description: '', is_active: true }, (data) => {
                          setNewDeptName('');
                          fetchDepartments();
                          setSelectedDeptId(data.id);
                          setSelectedCatId(null);
                        });
                      }
                    }}
                    placeholder="+ Add Department..."
                    className="w-full bg-white border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Column 2: Categories */}
              <div className={`flex-1 bg-white border rounded-2xl flex flex-col shadow-sm overflow-hidden transition-all duration-300 ${!selectedDeptId ? 'opacity-50 pointer-events-none' : ''} ${focusedCol === 1 ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
                <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-widest flex items-center justify-between">
                  Categories
                  <span className="bg-white border border-slate-200 text-slate-600 rounded-full px-2 py-0.5 text-[10px] shadow-sm">{displayedCategories.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1.5">
                  {!selectedDeptId ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-400 text-xs font-semibold bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Select a Department first</div>
                    </div>
                  ) : displayedCategories.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-400 text-xs font-semibold bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">No categories found</div>
                    </div>
                  ) : (
                    displayedCategories.map((cat, idx) => {
                      const isSelected = selectedCatId === cat.id;
                      const isFocused = focusedCol === 1 && focusedIdx === idx;
                      return (
                        <div 
                          key={cat.id} 
                          onClick={async () => { setSelectedCatId(cat.id); setFocusedCol(1); setFocusedIdx(idx); }}
                          className={`px-3 py-2.5 rounded-xl cursor-pointer font-bold text-xs border transition-all flex justify-between items-center ${
                            isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 
                            isFocused ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {cat.default_cut && <span className={`text-[10px] px-1.5 py-0.5 rounded shadow-sm ${isSelected ? 'bg-indigo-700 text-indigo-100 border border-indigo-500' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>Cut: {cat.default_cut}</span>}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className={`p-3 bg-slate-50/50 border-t border-slate-100 ${focusedCol === 1 && focusedIdx === displayedCategories.length ? 'bg-indigo-50/50' : ''}`}>
                  <input 
                    ref={inputCatRef}
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    onFocus={() => { setFocusedCol(1); setFocusedIdx(displayedCategories.length); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newCatName.trim() && selectedDeptId) {
                        handleAdd(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category`, { name: newCatName.trim(), department_id: selectedDeptId, parent_id: null }, (data) => {
                          setNewCatName('');
                          fetchCategories();
                          setSelectedCatId(data.id);
                        });
                      }
                    }}
                    disabled={!selectedDeptId}
                    placeholder="+ Add Category..."
                    className="w-full bg-white border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Column 3: SubCategories */}
              <div className={`flex-1 bg-white border rounded-2xl flex flex-col shadow-sm overflow-hidden transition-all duration-300 ${!selectedCatId ? 'opacity-50 pointer-events-none' : ''} ${focusedCol === 2 ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
                <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 font-bold text-slate-700 text-xs uppercase tracking-widest flex items-center justify-between">
                  Sub Categories
                  <span className="bg-white border border-slate-200 text-slate-600 rounded-full px-2 py-0.5 text-[10px] shadow-sm">{displayedSubCategories.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1.5">
                   {!selectedCatId ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-400 text-xs font-semibold bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Select a Category first</div>
                    </div>
                  ) : displayedSubCategories.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-400 text-xs font-semibold bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">No subcategories found</div>
                    </div>
                  ) : (
                    displayedSubCategories.map((subcat, idx) => {
                      const isFocused = focusedCol === 2 && focusedIdx === idx;
                      return (
                        <div 
                          key={subcat.id} 
                          onClick={async () => { setFocusedCol(2); setFocusedIdx(idx); }}
                          className={`px-3 py-2.5 rounded-xl cursor-pointer font-bold text-xs border flex justify-between items-center transition-all ${
                            isFocused ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{subcat.name}</span>
                          {subcat.default_cut && <span className={`text-[10px] px-1.5 py-0.5 rounded shadow-sm bg-slate-100 text-slate-500 border border-slate-200`}>Cut: {subcat.default_cut}</span>}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className={`p-3 bg-slate-50/50 border-t border-slate-100 ${focusedCol === 2 && focusedIdx === displayedSubCategories.length ? 'bg-indigo-50/50' : ''}`}>
                  <input 
                    ref={inputSubCatRef}
                    type="text"
                    value={newSubCatName}
                    onChange={e => setNewSubCatName(e.target.value)}
                    onFocus={() => { setFocusedCol(2); setFocusedIdx(displayedSubCategories.length); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSubCatName.trim() && selectedCatId) {
                        handleAdd(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category`, { name: newSubCatName.trim(), parent_id: selectedCatId, department_id: selectedDeptId }, () => {
                          setNewSubCatName('');
                          fetchCategories();
                        });
                      }
                    }}
                    disabled={!selectedCatId}
                    placeholder="+ Add SubCategory..."
                    className="w-full bg-white border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
