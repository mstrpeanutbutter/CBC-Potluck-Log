
import React, { useState, KeyboardEvent } from 'react';
import { PersonalAllergen } from '../types';

interface TagInputProps {
  tags: PersonalAllergen[];
  onAdd: (tag: string) => void;
  onRemove: (tagName: string) => void;
  onToggleSerious: (tagName: string) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onAdd, onRemove, onToggleSerious, placeholder = "Add allergen..." }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const value = inputValue.trim().replace(/,$/, '');
    if (value && !tags.some(t => t.name.toLowerCase() === value.toLowerCase())) {
      onAdd(value);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {tags.map((tag) => (
          <span
            key={tag.name}
            className={`inline-flex items-center pl-3 pr-1 py-1.5 rounded-full text-xs font-bold border shadow-sm transition-all ${
              tag.isSerious 
                ? 'bg-red-100 text-red-800 border-red-300 ring-2 ring-red-200' 
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggleSerious(tag.name)}
              title={tag.isSerious ? "Mark as normal" : "Mark as EXTRA serious"}
              className={`mr-2 flex items-center justify-center p-1 rounded-full transition-colors ${
                tag.isSerious ? 'bg-red-200 hover:bg-red-300 text-red-900' : 'bg-blue-200 hover:bg-blue-300 text-blue-900'
              }`}
            >
              <span role="img" aria-label="serious" className={tag.isSerious ? 'opacity-100' : 'opacity-40 grayscale'}>💀</span>
            </button>
            
            <span className="mr-2">{tag.name}</span>
            
            <button
              type="button"
              onClick={() => onRemove(tag.name)}
              className="inline-flex items-center justify-center h-5 w-5 rounded-full hover:bg-black/10 focus:outline-none"
            >
              <span className="sr-only">Remove {tag.name}</span>
              <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add
        </button>
      </div>
      <p className="text-[10px] text-gray-400 italic">Tip: Click the 💀 icon on a tag to mark that specific allergen as extra serious.</p>
    </div>
  );
};

export default TagInput;
