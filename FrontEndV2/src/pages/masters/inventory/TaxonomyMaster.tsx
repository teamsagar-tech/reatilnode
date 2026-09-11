import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGlobalKeyboard } from '../../../hooks/useGlobalKeyboard';

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && e.ctrlKey) handleSave(); // Ctrl+Enter to save to avoid accidental save
  };

  const handleSave = () => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleKeyDown}>
      <div className="bg-white border-2 border-[#1b5e58] shadow-2xl w-[400px] flex flex-col font-sans">
        <div className="bg-[#1b5e58] text-white px-2 py-1 font-bold text-[13px] flex justify-between">
          <span>Edit / Move {type === 0 ? 'Department' : type === 1 ? 'Category' : 'SubCategory'}</span>
          <button onClick={onClose} className="hover:text-red-300">X</button>
        </div>
        
        <div className="p-4 flex flex-col gap-3 text-[12px]">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Name</label>
            <input 
              ref={nameInputRef}
              value={name} 
              onChange={(e) => setName(e.target.value.toUpperCase())} 
              className="w-full border border-slate-400 px-2 py-1 focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 uppercase font-bold"
              placeholder="Name"
            />
          </div>

          {type !== 0 && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Default Cut (Quantity)</label>
              <input 
                type="number"
                step="0.01"
                value={defaultCut} 
                onChange={(e) => setDefaultCut(e.target.value)} 
                className="w-full border border-slate-400 px-2 py-1 focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 uppercase font-bold"
                placeholder="e.g. 1.20 or 3.00 (optional)"
              />
            </div>
          )}

          {type !== 0 && (
            <>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Level / Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="itemType" 
                      checked={itemType === 'category'} 
                      onChange={() => setItemType('category')} 
                    /> Category
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="itemType" 
                      checked={itemType === 'subcategory'} 
                      onChange={() => setItemType('subcategory')} 
                    /> Sub Category
                  </label>
                </div>
              </div>

              {itemType === 'category' ? (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Belongs To Department</label>
                  <select 
                    value={deptId}
                    onChange={e => setDeptId(e.target.value)}
                    className="w-full border border-slate-400 px-2 py-1 focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 uppercase font-bold"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Belongs To Category</label>
                  <select 
                    value={parentId}
                    onChange={e => setParentId(e.target.value)}
                    className="w-full border border-slate-400 px-2 py-1 focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 uppercase font-bold"
                  >
                    <option value="">Select Parent Category</option>
                    {categories.filter((c:any) => !c.parent_id).map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="bg-[#eef5ed] p-2 flex justify-end gap-2 border-t border-slate-300">
          <button onClick={onClose} className="px-4 py-1 border border-slate-400 bg-white font-bold hover:bg-slate-100">Cancel</button>
          <button onClick={handleSave} className="px-4 py-1 border border-[#1b5e58] bg-[#1b5e58] text-white font-bold hover:bg-[#144944]">Save (Ctrl+Enter)</button>
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && e.ctrlKey) handleSave();
  };

  const handleSave = () => {
    if (!targetId) return;
    onMerge(sourceItem.id, targetId);
  };

  if (!isOpen || !sourceItem) return null;

  const typeName = type === 1 ? 'Category' : 'SubCategory';
  const availableTargets = (type === 1 ? categories : subCategories).filter((c: any) => c.id !== sourceItem.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleKeyDown}>
      <div className="bg-white border-2 border-red-700 shadow-2xl w-[450px] flex flex-col font-sans">
        <div className="bg-red-700 text-white px-2 py-1 font-bold text-[13px] flex justify-between">
          <span>Merge {typeName}</span>
          <button onClick={onClose} className="hover:text-red-300">X</button>
        </div>
        
        <div className="p-4 flex flex-col gap-4 text-[12px]">
          <div className="bg-red-50 text-red-800 border border-red-200 p-2 font-bold">
            WARNING: You are about to merge <span className="text-black bg-yellow-200 px-1">{sourceItem.name}</span>. 
            This will permanently delete it and move all its associated items to the target {typeName}.
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Target {typeName} to merge into:</label>
            <select 
              ref={selectRef}
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="w-full border border-slate-400 px-2 py-2 focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 uppercase font-bold"
            >
              <option value="">-- SELECT TARGET --</option>
              {availableTargets.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bg-[#eef5ed] p-2 flex justify-end gap-2 border-t border-slate-300">
          <button onClick={onClose} className="px-4 py-1 border border-slate-400 bg-white font-bold hover:bg-slate-100">Cancel</button>
          <button onClick={handleSave} disabled={!targetId} className="px-4 py-1 border border-red-700 bg-red-700 text-white font-bold hover:bg-red-800 disabled:opacity-50">Merge (Ctrl+Enter)</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Taxonomy Page ---
export default function TaxonomyMaster() {
  const navigate = useNavigate();
  useGlobalKeyboard();

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

  const fetchDepartments = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/departments`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setDepartments(Array.isArray(data) ? data : []))
    .catch(console.error);
  };

  const fetchCategories = () => {
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
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
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
          if (focusedCol === 0 && !selectedDeptId) return; // Cant move right if no dept selected
          if (focusedCol === 1 && !selectedCatId) return; // Cant move right if no cat selected
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
          // Focus the input
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
        if (focusedIdx < maxIdx && focusedCol > 0) { // Can't merge departments yet
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

      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation (F4: Edit, F6: Merge, DEL: Delete)</div>
               <div className='text-yellow-300'>Taxonomy Hierarchy</div>
            </div>

            {errorMsg && (
              <div className="bg-red-200 text-red-900 border border-red-500 px-2 py-1 text-[12px] font-bold mx-2 mt-2">
                {errorMsg}
              </div>
            )}
            
            <div className='p-2 flex-1 overflow-hidden flex gap-4'>
              
              {/* Column 1: Departments */}
              <div className={`flex-1 border-2 bg-white flex flex-col shadow-sm ${focusedCol === 0 ? 'border-blue-500' : 'border-slate-400'}`}>
                <div className="bg-[#eef5ed] border-b border-slate-400 px-2 py-1 font-bold text-slate-800 text-[12px] text-center uppercase tracking-wider">
                  Departments
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1 flex flex-col gap-1">
                  {departments.map((dept, idx) => {
                    const isSelected = selectedDeptId === dept.id;
                    const isFocused = focusedCol === 0 && focusedIdx === idx;
                    return (
                      <div 
                        key={dept.id} 
                        onClick={() => { setSelectedDeptId(dept.id); setSelectedCatId(null); setFocusedCol(0); setFocusedIdx(idx); }}
                        className={`px-2 py-1 cursor-pointer font-bold text-[12px] border ${
                          isFocused ? 'bg-blue-100 border-blue-400' : 
                          isSelected ? 'bg-[#ffe000] border-yellow-500' : 'bg-[#fcfaf2] border-slate-300 hover:bg-[#ffffe0]'
                        }`}
                      >
                        {dept.name}
                      </div>
                    );
                  })}
                </div>
                <div className={`p-1 bg-[#f8f9fa] border-t border-slate-400 ${focusedCol === 0 && focusedIdx === departments.length ? 'ring-2 ring-blue-500' : ''}`}>
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
                    placeholder="Add New Department..."
                    className="w-full bg-white border border-slate-400 px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Column 2: Categories */}
              <div className={`flex-1 border-2 bg-white flex flex-col shadow-sm ${!selectedDeptId ? 'opacity-50 pointer-events-none' : ''} ${focusedCol === 1 ? 'border-blue-500' : 'border-slate-400'}`}>
                <div className="bg-[#eef5ed] border-b border-slate-400 px-2 py-1 font-bold text-slate-800 text-[12px] text-center uppercase tracking-wider">
                  Categories
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1 flex flex-col gap-1">
                  {!selectedDeptId ? (
                    <div className="text-center text-slate-500 mt-10 text-[11px] italic">Select a Department first</div>
                  ) : displayedCategories.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10 text-[11px] italic">No categories found.</div>
                  ) : (
                    displayedCategories.map((cat, idx) => {
                      const isSelected = selectedCatId === cat.id;
                      const isFocused = focusedCol === 1 && focusedIdx === idx;
                      return (
                        <div 
                          key={cat.id} 
                          onClick={() => { setSelectedCatId(cat.id); setFocusedCol(1); setFocusedIdx(idx); }}
                          className={`px-2 py-1 cursor-pointer font-bold text-[12px] border flex justify-between items-center ${
                            isSelected ? 'bg-[#1b5e58] text-white border-[#1b5e58]' : 
                            isFocused ? 'bg-blue-100 border-blue-400' : 'bg-[#fcfaf2] border-slate-300 hover:bg-[#ffffe0]'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {cat.default_cut && <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-white text-black' : 'bg-slate-200 text-slate-600'}`}>Cut: {cat.default_cut}</span>}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className={`p-1 bg-[#f8f9fa] border-t border-slate-400 ${focusedCol === 1 && focusedIdx === displayedCategories.length ? 'ring-2 ring-blue-500' : ''}`}>
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
                    placeholder="Add New Category..."
                    className="w-full bg-white border border-slate-400 px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Column 3: SubCategories */}
              <div className={`flex-1 border-2 bg-white flex flex-col shadow-sm ${!selectedCatId ? 'opacity-50 pointer-events-none' : ''} ${focusedCol === 2 ? 'border-blue-500' : 'border-slate-400'}`}>
                <div className="bg-[#eef5ed] border-b border-slate-400 px-2 py-1 font-bold text-slate-800 text-[12px] text-center uppercase tracking-wider">
                  Sub Categories
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1 flex flex-col gap-1">
                   {!selectedCatId ? (
                    <div className="text-center text-slate-500 mt-10 text-[11px] italic">Select a Category first</div>
                  ) : displayedSubCategories.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10 text-[11px] italic">No subcategories found.</div>
                  ) : (
                    displayedSubCategories.map((subcat, idx) => {
                      const isFocused = focusedCol === 2 && focusedIdx === idx;
                      return (
                        <div 
                          key={subcat.id} 
                          onClick={() => { setFocusedCol(2); setFocusedIdx(idx); }}
                          className={`px-2 py-1 cursor-pointer font-bold text-[12px] border flex justify-between items-center ${
                            isFocused ? 'bg-blue-100 border-blue-400' : 'bg-[#fcfaf2] border-slate-300 hover:bg-[#ffffe0]'
                          }`}
                        >
                          <span>{subcat.name}</span>
                          {subcat.default_cut && <span className={`text-[10px] px-1 rounded bg-slate-200 text-slate-600`}>Cut: {subcat.default_cut}</span>}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className={`p-1 bg-[#f8f9fa] border-t border-slate-400 ${focusedCol === 2 && focusedIdx === displayedSubCategories.length ? 'ring-2 ring-blue-500' : ''}`}>
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
                    placeholder="Add New SubCategory..."
                    className="w-full bg-white border border-slate-400 px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 disabled:bg-slate-100"
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
