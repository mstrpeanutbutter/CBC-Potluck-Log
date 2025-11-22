
import React, { useState, useRef, useEffect } from 'react';
import { Dish, Category, Potluck, User } from './types';
import { CATEGORIES } from './constants';
import DishList from './components/DishList';
import PotluckMenu from './components/PotluckMenu';
import AdminModal from './components/AdminModal';
import PadlockIcon from './components/icons/PadlockIcon';
import CategoryChart from './components/CategoryChart';
import LoginScreen from './components/LoginScreen';

const initialFormState = {
  dishName: '',
  allergens: '',
  extras: '',
  category: Category.MAIN,
  imageUrl: '',
};

const INITIAL_DISHES: Dish[] = [
    { id: 1, personName: 'Soup', dishName: 'Bean Pot Pie', category: Category.DESSERT, allergens: '' },
    { id: 2, personName: 'Cat', dishName: 'Focaccia', category: Category.DESSERT, allergens: '' },
    { id: 3, personName: 'KT', dishName: 'Pineapple Cheddar Casserole', category: Category.SIDE, allergens: '' },
    { id: 4, personName: 'Devon', dishName: 'Tofu Bacon Jam with Crackers and Cranberry Sauce', category: Category.APPETIZER, allergens: '' },
    { id: 5, personName: 'Nat', dishName: 'Au Gratin Potato', category: Category.POTATO, allergens: '' },
    { id: 6, personName: 'Marie', dishName: "T'rky Roasts, Cheezy Cranberry Bites, Pie", category: Category.MAIN, allergens: 'Soy, Gluten, Nuts' },
    { id: 7, personName: 'Lina', dishName: 'Mac N Cheese', category: Category.SIDE, allergens: '' },
    { id: 8, personName: 'Kim', dishName: 'Some Kind of Green Salad', category: Category.SIDE, allergens: '' },
    { id: 9, personName: 'Abbey', dishName: 'Green Bean Casserole', category: Category.SIDE, allergens: 'Gluten' },
    { id: 10, personName: 'Marissa', dishName: 'Herb-crusted Cauliflower and Leek "Cheese"', category: Category.SIDE, allergens: 'Gluten' },
    { id: 11, personName: 'Diana', dishName: 'Potato Salad', category: Category.POTATO, allergens: '' },
    { id: 12, personName: 'Haz', dishName: 'Roasted Brussels Sprouts with Balsamic Glaze', category: Category.SIDE, allergens: '' },
    { id: 13, personName: 'S', dishName: 'Sweet Potato Casserole', category: Category.POTATO, allergens: '' },
    { id: 14, personName: 'Kiley', dishName: 'Cornbread', category: Category.BREAD, allergens: '' },
    { id: 15, personName: 'Jenni', dishName: 'Mushroom Wellington', category: Category.MAIN, allergens: '' },
    { id: 16, personName: 'Paul', dishName: 'Apple Crisp', category: Category.DESSERT, allergens: '' },
    { id: 17, personName: 'Lizzy', dishName: 'Miso Butter Garlic Bread and Tofu Stracciatella Balls', category: Category.BREAD, allergens: 'Gluten, Soy, Cashews' },
    { id: 18, personName: 'Pancake', dishName: 'Mashed Potatoes with Mushroom Gravy', category: Category.POTATO, allergens: '' },
    { id: 19, personName: 'Divjyot', dishName: 'Pulao (Indian Rice Dish with Veggies, Spicy)', category: Category.SIDE, allergens: '' },
    { id: 20, personName: 'Mae', dishName: "Gardein Turk'y Roast", category: Category.DESSERT, allergens: 'Gluten, Soy' },
    { id: 21, personName: 'Kyle', dishName: 'Boller I Karry', category: Category.SIDE, allergens: '' },
    { id: 22, personName: 'Dileep', dishName: 'Quinoa Salad with Cider Vinaigrette', category: Category.SIDE, allergens: '' },
    { id: 23, personName: 'Lindsey', dishName: 'Lentil/Faux Meatloaf', category: Category.SIDE, allergens: '' },
];

const SOUPVEMBER_DISHES: Dish[] = [
    { id: 24, personName: 'Marie and Tim', dishName: 'Broccoli cheddar', category: Category.MAIN, allergens: 'Gluten, tree nuts', extras: 'Sourdough loaf for dipping' },
    { id: 25, personName: 'Soup', dishName: 'Myself jk butternut squash', category: Category.MAIN, allergens: 'Tree nuts', extras: '' },
    { id: 26, personName: 'Marissa', dishName: 'Avgolemono', category: Category.MAIN, allergens: '', extras: '' },
    { id: 27, personName: 'Devon', dishName: '"Beef" Stew', category: Category.MAIN, allergens: 'Soy, Gluten', extras: '' },
    { id: 28, personName: 'Diana', dishName: 'Peruvian Aguadito', category: Category.MAIN, allergens: 'Cilantro', extras: 'Maybe a second soup' },
    { id: 29, personName: 'Kim', dishName: 'Gambian peanut stew', category: Category.MAIN, allergens: '', extras: '' },
    { id: 30, personName: 'Kyle', dishName: 'cookies bc all my soup ideas were taken', category: Category.DESSERT, allergens: 'gluten', extras: '' },
    { id: 31, personName: 'Cat', dishName: 'Mushroom and wild rice soup', category: Category.MAIN, allergens: 'Tree nuts (cashew)', extras: 'Probably a couple baguettes' },
    { id: 32, personName: 'Vinay', dishName: 'Daal (lentil soup)', category: Category.MAIN, allergens: '', extras: '' },
    { id: 33, personName: 'lina', dishName: 'pumpkin gnocchi soup', category: Category.MAIN, allergens: '', extras: '' },
    { id: 34, personName: 'KT', dishName: 'loaded potato soup', category: Category.MAIN, allergens: '', extras: 'vegan bacon bits for bedazzlement' },
    { id: 35, personName: 'Nat', dishName: 'maybe pho? tbd', category: Category.MAIN, allergens: '', extras: '' },
    { id: 36, personName: 'louis', dishName: 'is chili a soup???', category: Category.MAIN, allergens: 'TBD - likely soy but can be without', extras: '' },
    { id: 37, personName: 'Haz', dishName: 'Turkish red lentil soup', category: Category.MAIN, allergens: '', extras: '' },
    { id: 38, personName: 'Div', dishName: 'Mulligatawny soup', category: Category.MAIN, allergens: '', extras: '' },
    { id: 39, personName: 'Abbey', dishName: 'Lasagna soup', category: Category.MAIN, allergens: 'Wheat/gluten', extras: '' },
    { id: 40, personName: 'Lindsey', dishName: 'caldo de res', category: Category.MAIN, allergens: 'wheat', extras: '' },
    { id: 41, personName: 'Kiley', dishName: 'White bean chili (not a tomato based broth/chili)', category: Category.MAIN, allergens: '', extras: '' },
    { id: 42, personName: 'Pancake', dishName: 'Rasmalai', category: Category.DESSERT, allergens: '', extras: '' },
    { id: 43, personName: 'Paul', dishName: 'Potato Leek Soup', category: Category.MAIN, allergens: '', extras: '' },
    { id: 44, personName: 'Lizzy', dishName: 'Sweet potato curry', category: Category.MAIN, allergens: 'Probably gluten, coconut', extras: '' },
    { id: 45, personName: 'Emily', dishName: 'Italian Bean Soup maybe?', category: Category.MAIN, allergens: '', extras: '' },
];


const INITIAL_POTLUCKS: Potluck[] = [
    {
        id: 1,
        name: 'Friendsgiving 2025',
        dishes: INITIAL_DISHES,
        bookTheme: 'Isa Does It',
        host: 'Soup & Cat',
        neighborhood: 'Logan Square',
        date: 'November 23, 2025',
        time: '5:00 PM',
        dishCap: 40,
    },
    {
        id: 2,
        name: 'Soupvember 2025',
        dishes: SOUPVEMBER_DISHES,
        dishCap: 25,
    }
];


const App: React.FC = () => {
  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App State
  const [potlucks, setPotlucks] = useState<Potluck[]>(INITIAL_POTLUCKS);
  const [selectedPotluckId, setSelectedPotluckId] = useState<number>(INITIAL_POTLUCKS[0].id);
  const [newDish, setNewDish] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [editingDishId, setEditingDishId] = useState<number | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cvcc_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('cvcc_user');
      }
    }
  }, []);

  const handleJoin = (name: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: name,
      isAdmin: false
    };
    setCurrentUser(newUser);
    localStorage.setItem('cvcc_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cvcc_user');
  };

  const activePotluck = potlucks.find(p => p.id === selectedPotluckId);
  const activeDishes = activePotluck ? activePotluck.dishes : [];
  const dishCap = activePotluck?.dishCap;
  // Only consider full if cap is defined and we reached it
  const isFull = dishCap !== undefined && activeDishes.length >= dishCap;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDish(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDish(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = (dish: Dish) => {
    setEditingDishId(dish.id);
    setNewDish({
      dishName: dish.dishName,
      allergens: dish.allergens,
      extras: dish.extras || '',
      category: dish.category,
      imageUrl: dish.imageUrl || '',
    });
    setError(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingDishId(null);
    setNewDish(initialFormState);
    setError(null);
  };

  const handleDeleteDish = (id: number) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
        setPotlucks(prevPotlucks => 
            prevPotlucks.map(p => 
              p.id === selectedPotluckId 
                ? { ...p, dishes: p.dishes.filter(dish => dish.id !== id) } 
                : p
            )
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    if (!newDish.dishName.trim()) {
      setError('Dish name is required.');
      return;
    }

    if (!newDish.allergens.trim()) {
      setError('Allergens field is required. Please write "N/A" if no major allergens are present.');
      return;
    }

    // Prevent adding if full and not editing an existing dish
    if (isFull && editingDishId === null) {
        setError('This potluck has reached its maximum capacity. No new dishes can be added.');
        return;
    }

    setPotlucks(prevPotlucks => prevPotlucks.map(p => {
        if (p.id !== selectedPotluckId) {
            return p;
        }

        let updatedDishes;
        if (editingDishId !== null) {
            // Updating existing dish
            updatedDishes = p.dishes.map(dish => 
                dish.id === editingDishId 
                  ? { ...dish, ...newDish } // Keep original personName and userId
                  : dish
            );
        } else {
            // Creating new dish
            updatedDishes = [
                ...p.dishes,
                { 
                  id: Date.now(), 
                  personName: currentUser.name, // Auto-fill name
                  userId: currentUser.id,     // Auto-fill user ID
                  ...newDish 
                }
            ];
        }
        return { ...p, dishes: updatedDishes };
    }));
    
    handleCancelEdit();
  };
  
  const handleAdminClick = () => {
    // If user is already admin, open modal to manage potlucks
    if (currentUser?.isAdmin) {
        setIsAdminModalOpen(true);
        return;
    }

    // Otherwise, try to login as admin
    const password = prompt('Enter admin password:');
    if (password === 'susscrofadomesticus') {
      if (currentUser) {
          const adminUser = { ...currentUser, isAdmin: true };
          setCurrentUser(adminUser);
          localStorage.setItem('cvcc_user', JSON.stringify(adminUser));
          alert("You are now in Admin Mode. You can edit all dishes.");
          setIsAdminModalOpen(true);
      }
    } else if (password !== null) { 
      alert('Incorrect password.');
    }
  };

  const handleAddPotluck = (potluckData: Omit<Potluck, 'id' | 'dishes'>) => {
    const newPotluck: Potluck = {
      id: Date.now(),
      ...potluckData,
      dishes: [],
    };
    setPotlucks(prev => [...prev, newPotluck]);
    setSelectedPotluckId(newPotluck.id); 
  };

  const handleDeletePotluck = (id: number) => {
    setPotlucks(prev => {
      const newPotlucks = prev.filter(p => p.id !== id);
      if (selectedPotluckId === id) {
        setSelectedPotluckId(newPotlucks[0]?.id || -1);
      }
      return newPotlucks;
    });
  };

  const handleEditPotluck = (id: number, potluckData: Partial<Omit<Potluck, 'id' | 'dishes'>>) => {
    setPotlucks(prev => 
      prev.map(p => (p.id === id ? { ...p, ...potluckData } : p))
    );
  };


  // If no user is logged in, show Login Screen
  if (!currentUser) {
    return <LoginScreen onJoin={handleJoin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto relative">
        <header className="text-center mb-8">
           <div className="absolute top-0 left-0 p-2 sm:p-0 z-10 flex items-center gap-2">
                <button
                    onClick={handleAdminClick}
                    className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${currentUser.isAdmin ? 'text-green-600 bg-green-100 hover:bg-green-200' : 'text-gray-400 hover:bg-gray-100'}`}
                    aria-label="Admin Settings"
                    title={currentUser.isAdmin ? "Admin Settings" : "Unlock Admin Mode"}
                >
                    <PadlockIcon />
                </button>
            </div>
          <div className="absolute top-0 right-0 p-2 sm:p-0 z-10 flex items-center gap-2">
            <span className="hidden sm:block text-sm text-gray-500">Hi, {currentUser.name}</span>
            <button onClick={handleLogout} className="text-xs text-red-500 underline hover:text-red-700 mr-2">Logout</button>
            <PotluckMenu 
              potlucks={potlucks} 
              selectedPotluckId={selectedPotluckId} 
              onSelectPotluck={setSelectedPotluckId}
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800">Chicago Vegan Cookbook Club</h1>
          <p className="text-lg text-gray-600 mt-2">{activePotluck?.name ?? 'Monthly Potluck'}</p>
           {activePotluck && (
            <div className="mt-4 text-sm text-gray-600 flex flex-col sm:flex-row sm:flex-wrap justify-center items-center sm:gap-x-6 gap-y-1">
                {activePotluck.bookTheme && <p><strong>Theme:</strong> {activePotluck.bookTheme}</p>}
                {activePotluck.host && <p><strong>Host:</strong> {activePotluck.host}</p>}
                {activePotluck.neighborhood && <p><strong>Neighborhood:</strong> {activePotluck.neighborhood}</p>}
                {activePotluck.date && <p><strong>Date:</strong> {activePotluck.date}</p>}
                {activePotluck.time && <p><strong>Time:</strong> {activePotluck.time}</p>}
            </div>
          )}
        </header>

        <main>
          <div ref={formRef} className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8 scroll-mt-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                {editingDishId ? 'Edit Dish' : 'Add a New Dish'}
                </h2>
                <div className="text-sm bg-green-50 text-green-800 px-3 py-1 rounded-full">
                    Posting as: <strong>{currentUser.name}</strong>
                </div>
            </div>

            {dishCap && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                    <span>Potluck Capacity</span>
                    <span className={isFull ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {activeDishes.length} / {dishCap} filled
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 transition-all duration-500 ${
                        isFull ? 'bg-red-500' : activeDishes.length >= dishCap * 0.8 ? 'bg-yellow-400' : 'bg-green-500'
                      }`} 
                      style={{ width: `${Math.min(100, (activeDishes.length / dishCap) * 100)}%` }}
                    ></div>
                  </div>
                  {isFull && !editingDishId && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                          This potluck has reached its maximum capacity. No new dishes can be added at this time.
                      </p>
                  )}
                </div>
            )}
            
            <fieldset disabled={isFull && !editingDishId} className="group disabled:opacity-60">
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="dishName" className="block text-sm font-medium text-gray-600 mb-1">Dish Name</label>
                    <input
                        type="text"
                        id="dishName"
                        name="dishName"
                        value={newDish.dishName}
                        onChange={handleInputChange}
                        placeholder="e.g., Spicy Black Bean Burgers"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                        <select
                        id="category"
                        name="category"
                        value={newDish.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                        >
                        {CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="allergens" className="block text-sm font-medium text-gray-600 mb-1">Major Allergens</label>
                    <input
                    type="text"
                    id="allergens"
                    name="allergens"
                    value={newDish.allergens}
                    onChange={handleInputChange}
                    placeholder="e.g., Nuts, Soy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Write "N/A" if no major allergens present.</p>
                </div>

                <div>
                    <label htmlFor="extras" className="block text-sm font-medium text-gray-600 mb-1">Any Extras (optional)</label>
                    <input
                    type="text"
                    id="extras"
                    name="extras"
                    value={newDish.extras || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Serving spoons, extension cord"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-600 mb-1">Dish Image (optional)</label>
                    <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {newDish.imageUrl && (
                    <div className="mt-4">
                        <img src={newDish.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md border border-gray-200" />
                    </div>
                    )}
                </div>

                <p className="text-sm text-red-600 font-medium">
                    ALLERGENS (please share if your dish contains the following): hemp seeds, gluten, peanuts, other nuts, etc
                </p>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-end items-center gap-4 pt-2">
                    {editingDishId && (
                    <button type="button" onClick={handleCancelEdit} className="py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Cancel
                    </button>
                    )}
                    <button 
                        type="submit" 
                        disabled={isFull && !editingDishId}
                        className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-colors
                            ${isFull && !editingDishId 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                            }`}
                    >
                    {editingDishId ? 'Update Dish' : 'Add Dish'}
                    </button>
                </div>
                </form>
            </fieldset>
          </div>

          <CategoryChart dishes={activeDishes} />

          <DishList 
            dishes={activeDishes} 
            currentUserId={currentUser.id}
            isAdmin={currentUser.isAdmin}
            onEdit={handleStartEdit} 
            onDelete={handleDeleteDish} 
          />
        </main>
      </div>
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        potlucks={potlucks}
        onAdd={handleAddPotluck}
        onEdit={handleEditPotluck}
        onDelete={handleDeletePotluck}
      />
    </div>
  );
};

export default App;
