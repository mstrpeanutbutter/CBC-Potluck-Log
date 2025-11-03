import React, { useState, useRef, useEffect } from 'react';
import { Potluck } from '../types';

interface PotluckMenuProps {
  potlucks: Potluck[];
  selectedPotluckId: number;
  onSelectPotluck: (id: number) => void;
}

const HamburgerIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4"></path>
    </svg>
);

const PotluckMenu: React.FC<PotluckMenuProps> = ({ potlucks, selectedPotluckId, onSelectPotluck }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleSelect = (id: number) => {
        onSelectPotluck(id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label="Select Potluck"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <HamburgerIcon />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                    <div className="px-4 py-2 text-sm text-gray-500">Select a Potluck</div>
                    {potlucks.map((potluck) => (
                        <button
                            key={potluck.id}
                            onClick={() => handleSelect(potluck.id)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                                potluck.id === selectedPotluckId
                                    ? 'bg-green-100 text-green-800 font-semibold'
                                    : 'text-gray-700'
                            } hover:bg-gray-100`}
                            role="menuitem"
                        >
                            {potluck.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PotluckMenu;
