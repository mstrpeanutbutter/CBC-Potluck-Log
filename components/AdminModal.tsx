import React, { useState } from 'react';
import { Potluck } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  potlucks: Potluck[];
  onAdd: (potluckData: Omit<Potluck, 'id' | 'dishes'>) => void;
  onEdit: (id: number, potluckData: Partial<Omit<Potluck, 'id' | 'dishes'>>) => void;
  onDelete: (id: number) => void;
}

// Helper interface for form state which may handle numbers as empty strings during input
interface PotluckFormState {
    name: string;
    bookTheme: string;
    host: string;
    neighborhood: string;
    date: string;
    time: string;
    dishCap: string | number;
}

const initialPotluckFormState: PotluckFormState = {
    name: '',
    bookTheme: '',
    host: '',
    neighborhood: '',
    date: '',
    time: '',
    dishCap: '',
};

const PotluckFormFields: React.FC<{
    data: PotluckFormState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ data, onChange }) => (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Potluck Name*</label>
            <input id="name" name="name" value={data.name} onChange={onChange} required placeholder="e.g., Summer Picnic 2026" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" autoFocus />
        </div>
        <div>
            <label htmlFor="bookTheme" className="block text-sm font-medium text-gray-600 mb-1">Book/Theme</label>
            <input id="bookTheme" name="bookTheme" value={data.bookTheme || ''} onChange={onChange} placeholder="e.g., Veganomicon" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-600 mb-1">Host</label>
            <input id="host" name="host" value={data.host || ''} onChange={onChange} placeholder="e.g., Jane & John" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-600 mb-1">Neighborhood</label>
            <input id="neighborhood" name="neighborhood" value={data.neighborhood || ''} onChange={onChange} placeholder="e.g., Lincoln Park" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">Date</label>
            <input id="date" name="date" value={data.date || ''} onChange={onChange} placeholder="e.g., July 4, 2026" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-600 mb-1">Time</label>
            <input id="time" name="time" value={data.time || ''} onChange={onChange} placeholder="e.g., 6:00 PM" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
            <label htmlFor="dishCap" className="block text-sm font-medium text-gray-600 mb-1">Max Dishes (Optional Cap)</label>
            <input type="number" id="dishCap" name="dishCap" value={data.dishCap} onChange={onChange} min="1" placeholder="e.g., 25" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
    </div>
);


const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, potlucks, onAdd, onEdit, onDelete }) => {
  const [view, setView] = useState<'menu' | 'add' | 'editList' | 'editForm' | 'delete'>('menu');
  const [potluckForm, setPotluckForm] = useState<PotluckFormState>(initialPotluckFormState);
  // We use a separate state for editing to allow the flexible string/number type for inputs
  const [editingFormState, setEditingFormState] = useState<PotluckFormState | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (view === 'add') {
         setPotluckForm(prev => ({ ...prev, [name]: value }));
    } else if (view === 'editForm' && editingFormState) {
         setEditingFormState(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (potluckForm.name.trim()) {
      const submissionData = {
          ...potluckForm,
          dishCap: potluckForm.dishCap === '' ? undefined : Number(potluckForm.dishCap)
      };
      onAdd(submissionData);
      setPotluckForm(initialPotluckFormState);
      setView('menu');
    }
  };

  const handleDelete = (id: number) => {
    if (potlucks.length <= 1) {
        alert("You can't delete the last potluck!");
        return;
    }
    if (window.confirm('Are you sure you want to delete this potluck? This action cannot be undone.')) {
      onDelete(id);
    }
  };
  
  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFormState && editingId !== null && editingFormState.name.trim()) {
        if (window.confirm('Are you sure you want to save these changes?')) {
            const submissionData = {
                ...editingFormState,
                dishCap: editingFormState.dishCap === '' ? undefined : Number(editingFormState.dishCap)
            };
            onEdit(editingId, submissionData);
            setEditingFormState(null);
            setEditingId(null);
            setView('editList');
        }
    }
  };
  
  const handleStartEdit = (potluck: Potluck) => {
    setEditingId(potluck.id);
    setEditingFormState({
        name: potluck.name,
        bookTheme: potluck.bookTheme || '',
        host: potluck.host || '',
        neighborhood: potluck.neighborhood || '',
        date: potluck.date || '',
        time: potluck.time || '',
        dishCap: potluck.dishCap === undefined ? '' : potluck.dishCap
    });
    setView('editForm');
  };

  const resetToMenu = () => {
    setView('menu');
    setPotluckForm(initialPotluckFormState);
    setEditingFormState(null);
    setEditingId(null);
  };
  
  const renderMenu = () => (
    <div className="space-y-4">
        <p className="text-gray-600">Select an action to manage your potlucks.</p>
        <button onClick={() => setView('add')} className="w-full text-left py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors font-medium text-gray-700">Add a new potluck</button>
        <button onClick={() => setView('editList')} className="w-full text-left py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors font-medium text-gray-700">Edit an existing potluck</button>
        <button onClick={() => setView('delete')} className="w-full text-left py-3 px-4 bg-gray-50 hover:bg-red-100 rounded-md transition-colors font-medium text-red-700">Delete an existing potluck</button>
    </div>
  );
  
  const renderAdd = () => (
    <form onSubmit={handleAddSubmit}>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Add New Potluck</h3>
        <PotluckFormFields data={potluckForm} onChange={handleFormChange} />
        <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={resetToMenu} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
            <button type="submit" className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">Add Potluck</button>
        </div>
    </form>
  );

  const renderDelete = () => (
    <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Delete a Potluck</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {potlucks.map(potluck => (
                <div key={potluck.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <span className="text-gray-800">{potluck.name}</span>
                    <button onClick={() => handleDelete(potluck.id)} className="text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
                </div>
            ))}
        </div>
         <div className="mt-6 flex justify-end">
            <button type="button" onClick={resetToMenu} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
        </div>
    </div>
  );

  const renderEditList = () => (
    <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Edit a Potluck</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {potlucks.map(potluck => (
                <div key={potluck.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <span className="text-gray-800">{potluck.name}</span>
                    <button onClick={() => handleStartEdit(potluck)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-end">
            <button type="button" onClick={resetToMenu} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
        </div>
    </div>
  );

  const renderEditForm = () => {
    if (!editingFormState) return null;
    return (
        <form onSubmit={handleEditSave}>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Editing "{editingFormState.name}"</h3>
            <PotluckFormFields data={editingFormState} onChange={handleFormChange} />
            <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => { setEditingFormState(null); setEditingId(null); setView('editList'); }} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">Confirm Changes</button>
            </div>
        </form>
    );
  };


  const renderContent = () => {
    switch(view) {
        case 'add': return renderAdd();
        case 'editList': return renderEditList();
        case 'editForm': return renderEditForm();
        case 'delete': return renderDelete();
        case 'menu':
        default:
            return renderMenu();
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-6">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;