
import React, { useState } from 'react';
import TagInput from './TagInput';
import { PersonalAllergen } from '../types';

interface LoginScreenProps {
  onJoin: (name: string, allergens: PersonalAllergen[], serious: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [allergens, setAllergens] = useState<PersonalAllergen[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // isSerious is true if any individual allergen is serious
      const anySerious = allergens.some(a => a.isSerious);
      onJoin(name.trim(), allergens, anySerious);
    }
  };

  const handleAddAllergen = (tagName: string) => {
    setAllergens([...allergens, { name: tagName, isSerious: false }]);
  };

  const handleRemoveAllergen = (tagName: string) => {
    setAllergens(allergens.filter((a) => a.name !== tagName));
  };

  const handleToggleSerious = (tagName: string) => {
    setAllergens(allergens.map(a => 
      a.name === tagName ? { ...a, isSerious: !a.isSerious } : a
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-green-100">Chicago Vegan Cookbook Club</p>
        </div>
        <div className="p-8">
          <p className="text-gray-600 mb-6 text-center">
            Please enter your name and any personal dietary restrictions to get started.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="loginName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name*
              </label>
              <input
                type="text"
                id="loginName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                required
                autoFocus
              />
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                <label className="block text-sm font-bold text-blue-800 mb-3">
                    Your Allergies / Restrictions
                </label>
                <TagInput 
                  tags={allergens} 
                  onAdd={handleAddAllergen} 
                  onRemove={handleRemoveAllergen} 
                  onToggleSerious={handleToggleSerious}
                  placeholder="e.g. Peanuts, Gluten"
                />
                <p className="text-[10px] text-blue-500 mt-4 italic leading-tight">Your restrictions will be automatically attached to any dishes you bring.</p>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              Join Potluck
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          Vegan food only, please! 🌱
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
