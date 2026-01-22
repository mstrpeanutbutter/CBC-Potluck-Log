
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Dish, Category, Potluck, User, WaitlistEntry, FirstInLineEntry, ActivityLogEntry } from './types';
import { CATEGORIES } from './constants';
import DishList from './components/DishList';
import PotluckMenu from './components/PotluckMenu';
import AdminModal from './components/AdminModal';
import PadlockIcon from './components/icons/PadlockIcon';
import CategoryChart from './components/CategoryChart';
// Fixed the broken import with a space in the component name
import DietaryRestrictionsChart from './components/DietaryRestrictionsChart';
import LoginScreen from './components/LoginScreen';
import ActivityLog from './components/ActivityLog';
import CountdownTimer from './components/CountdownTimer';

const WAITLIST_MAX = 10;
const RESERVATION_HOURS = 24;
const LOCK_AFTER_HOURS = 24;

const initialFormState = {
  dishName: '',
  allergens: '',
  extras: '',
  category: Category.MAIN,
  imageUrl: '',
  hasPlusOne: false,
  plusOneName: '',
  isParticipatingInCookieSwap: false,
  cookieSwapDescription: '',
  userDietaryRestrictions: '',
  isDietaryRestrictionSerious: false,
};

const INITIAL_POTLUCKS: Potluck[] = [
    {
        id: 1,
        name: 'Friendsgiving 2025',
        dishes: [],
        waitlist: [],
        firstInLine: null,
        bookTheme: 'Isa Does It',
        host: 'Soup & Cat',
        neighborhood: 'Logan Square',
        date: 'November 23, 2025',
        time: '5:00 PM',
        dishCap: 40,
        enableCookieSwap: true,
    },
    {
        id: 2,
        name: 'Soupvember 2025',
        dishes: [],
        waitlist: [],
        firstInLine: null,
        dishCap: 25,
        enableCookieSwap: false,
    },
    {
        id: 3,
        name: 'Test Potluck',
        bookTheme: 'Mockingbird Recipes',
        host: 'Developer',
        neighborhood: 'Virtual Garden',
        date: 'December 7, 2026',
        time: '6:30 PM',
        dishCap: 20,
        enableCookieSwap: true,
        buyBookLink: 'https://www.bookshop.org/mockingbird-recipes-vegan',
        authorWebsiteLink: 'https://www.themockingbirdchef.com',
        cplLink: 'https://chipublib.bibliocommons.com/v2/record/S126C12345678',
        waitlist: [
            { userId: 'wait_1', name: 'Penny', timestamp: 1730000000000 },
            { userId: 'wait_2', name: 'Oliver Onion', timestamp: 1730000000001 },
            { userId: 'wait_3', name: 'Basil Herb', timestamp: 1730000000002 },
            { userId: 'wait_4', name: 'Ginger Snap', timestamp: 1730000000003 },
            { userId: 'wait_5', name: 'Pepper Corn', timestamp: 1730000000004 },
            { userId: 'wait_6', name: 'Kale Salad', timestamp: 1730000000005 }
        ],
        firstInLine: null,
        dishes: [
            {
                id: 101,
                dishName: "Golden Lentil Soup",
                personName: "Alice Green",
                userId: "user_alice",
                allergens: "N/A",
                category: Category.MAIN,
                userDietaryRestrictions: "Gluten-Free",
                isDietaryRestrictionSerious: true,
                hasPlusOne: true,
                plusOneName: "Charlie"
            },
            {
                id: 102,
                dishName: "Rainbow Quinoa Salad",
                personName: "Bob Vegan",
                userId: "user_bob",
                allergens: "N/A",
                category: Category.SIDE,
                userDietaryRestrictions: "Nut-Free",
                isDietaryRestrictionSerious: false
            },
            {
                id: 103,
                dishName: "Mushroom Walnut Pâté",
                personName: "Daisy Sprout",
                userId: "user_daisy",
                allergens: "Walnuts",
                category: Category.APPETIZER,
                userDietaryRestrictions: "Soy-Free",
                isDietaryRestrictionSerious: false,
                isParticipatingInCookieSwap: true,
                cookieSwapDescription: "Oatmeal Raisin Bliss"
            },
            {
                id: 104,
                dishName: "Spicy Jackfruit Tacos",
                personName: "Ethan Leaf",
                userId: "user_ethan",
                allergens: "N/A",
                category: Category.MAIN
            },
            {
                id: 105,
                dishName: "Berry Raw Cheesecake",
                personName: "Fiona Fruit",
                userId: "user_fiona",
                allergens: "Cashews",
                category: Category.DESSERT,
                userDietaryRestrictions: "Raw Only",
                isDietaryRestrictionSerious: false,
                isParticipatingInCookieSwap: true,
                cookieSwapDescription: "Raw Cacao Stars"
            },
            {
                id: 106,
                dishName: "Rosemary Roasted Potatoes",
                personName: "George Root",
                userId: "user_george",
                allergens: "N/A",
                category: Category.POTATO
            },
            {
                id: 107,
                dishName: "Artisan Sourdough",
                personName: "Hannah Yeast",
                userId: "user_hannah",
                allergens: "Gluten",
                category: Category.BREAD,
                extras: "Vegan Garlic Butter"
            },
            {
                id: 108,
                dishName: "Sparkling Hibiscus Tea",
                personName: "Ian Dew",
                userId: "user_ian",
                allergens: "N/A",
                category: Category.BEVERAGE,
                userDietaryRestrictions: "No Added Sugar",
                isDietaryRestrictionSerious: false
            },
            {
                id: 109,
                dishName: "Compostable Plates & Cutlery",
                personName: "Julia Earth",
                userId: "user_julia",
                allergens: "N/A",
                category: Category.DINNERWARE
            },
            {
                id: 110,
                dishName: "Buffalo Cauliflower Wings",
                personName: "Kevin Spice",
                userId: "user_kevin",
                allergens: "Soy",
                category: Category.APPETIZER,
                hasPlusOne: false
            },
            {
                id: 111,
                dishName: "Lemon Garlic Pasta",
                personName: "Liam Lemon",
                userId: "user_liam",
                allergens: "N/A",
                category: Category.MAIN,
                userDietaryRestrictions: "Citrus",
                isDietaryRestrictionSerious: true
            },
            {
                id: 112,
                dishName: "Honeydew Sorbet",
                personName: "Mia Melon",
                userId: "user_mia",
                allergens: "N/A",
                category: Category.DESSERT,
                userDietaryRestrictions: "Low Sugar",
                isDietaryRestrictionSerious: false
            },
            {
                id: 113,
                dishName: "Zucchini Carpaccio",
                personName: "Noah Nightshade",
                userId: "user_noah",
                allergens: "N/A",
                category: Category.SIDE,
                userDietaryRestrictions: "Nightshades",
                isDietaryRestrictionSerious: true
            },
            {
                id: 114,
                dishName: "Stuffed Olives",
                personName: "Olivia Olive",
                userId: "user_olivia",
                allergens: "N/A",
                category: Category.APPETIZER,
                userDietaryRestrictions: "Low Sodium",
                isDietaryRestrictionSerious: false
            },
            {
                id: 115,
                dishName: "Mashed Sweet Potatoes",
                personName: "Peter Potato",
                userId: "user_peter",
                allergens: "N/A",
                category: Category.POTATO
            },
            {
                id: 116,
                dishName: "Quinoa Power Bowl",
                personName: "Quinn Quinoa",
                userId: "user_quinn",
                allergens: "N/A",
                category: Category.MAIN,
                userDietaryRestrictions: "High Protein",
                isDietaryRestrictionSerious: false
            },
            {
                id: 117,
                dishName: "Gluten-Free Focaccia",
                personName: "Ruby Rice",
                userId: "user_ruby",
                allergens: "N/A",
                category: Category.BREAD,
                userDietaryRestrictions: "Celiac (Strict Gluten Free)",
                isDietaryRestrictionSerious: true
            },
            {
                id: 118,
                dishName: "Soy-Free Tempeh Stir Fry",
                personName: "Sam Soy",
                userId: "user_sam",
                allergens: "N/A",
                category: Category.MAIN,
                userDietaryRestrictions: "Soy",
                isDietaryRestrictionSerious: true
            },
            {
                id: 119,
                dishName: "Tofu Scramble with Chives",
                personName: "Tina Tofu",
                userId: "user_tina",
                allergens: "Soy",
                category: Category.MAIN,
                userDietaryRestrictions: "Low Oil",
                isDietaryRestrictionSerious: false
            }
        ]
    }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [potlucks, setPotlucks] = useState<Potluck[]>(INITIAL_POTLUCKS);
  const [selectedPotluckId, setSelectedPotluckId] = useState<number>(3);
  const [dishForms, setDishForms] = useState<typeof initialFormState[]>([initialFormState]);
  const [error, setError] = useState<string | null>(null);
  const [editingDishId, setEditingDishId] = useState<number | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

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

  const addLogEntry = useCallback((action: ActivityLogEntry['action'], details: string) => {
    if (!currentUser) return;
    const newEntry: ActivityLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      userName: currentUser.name,
      action,
      details
    };
    setActivityLog(prev => [...prev.slice(-49), newEntry]); // Keep last 50
  }, [currentUser]);

  // Reservation Expiry Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      setPotlucks(prev => prev.map(p => {
        if (p.firstInLine && p.firstInLine.expiryTimestamp < now) {
          // Promote next if current expired
          const nextWaitlist = p.waitlist || [];
          const newFirst = nextWaitlist.length > 0 ? {
            ...nextWaitlist[0],
            expiryTimestamp: now + RESERVATION_HOURS * 60 * 60 * 1000
          } : null;
          
          return {
            ...p,
            firstInLine: newFirst,
            waitlist: nextWaitlist.slice(1)
          };
        }
        return p;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJoin = (name: string) => {
    const newUser: User = { id: Date.now().toString(), name: name, isAdmin: false };
    setCurrentUser(newUser);
    localStorage.setItem('cvcc_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cvcc_user');
  };

  const activePotluck = potlucks.find(p => p.id === selectedPotluckId);
  const activeDishes = activePotluck ? activePotluck.dishes : [];
  const activeWaitlist = activePotluck?.waitlist || [];
  const activeFirstInLine = activePotluck?.firstInLine;
  const dishCap = activePotluck?.dishCap;

  // Logic to determine if potluck is locked (24 hours after start)
  const isPotluckLocked = useMemo(() => {
    if (!activePotluck?.date) return false;
    const startTime = new Date(`${activePotluck.date} ${activePotluck.time || '12:00 PM'}`).getTime();
    const lockTime = startTime + (LOCK_AFTER_HOURS * 60 * 60 * 1000);
    return currentTime > lockTime;
  }, [activePotluck, currentTime]);

  const canModifyActivePotluck = !isPotluckLocked || currentUser?.isAdmin;
  
  const totalAttendees = activeDishes.reduce((acc, dish) => acc + 1 + (dish.hasPlusOne ? 1 : 0), 0);
  const cookieSwapParticipants = new Set(
    activeDishes
      .filter(d => d.isParticipatingInCookieSwap)
      .map(d => d.userId || d.personName)
  ).size;
  
  const isFull = dishCap !== undefined && totalAttendees >= dishCap;
  const isWaitlistFull = activeWaitlist.length >= WAITLIST_MAX;
  const isOnWaitlist = currentUser && activeWaitlist.some(entry => entry.userId === currentUser.id);
  const isFirstInLineUser = currentUser && activeFirstInLine?.userId === currentUser.id;

  // Promotion Logic whenever potlucks change
  useEffect(() => {
    if (activePotluck && dishCap !== undefined && totalAttendees < dishCap && !activeFirstInLine && activeWaitlist.length > 0) {
      setPotlucks(prev => prev.map(p => {
        if (p.id === selectedPotluckId && !p.firstInLine && (p.waitlist?.length || 0) > 0) {
          const next = p.waitlist![0];
          return {
            ...p,
            firstInLine: {
              ...next,
              expiryTimestamp: Date.now() + RESERVATION_HOURS * 60 * 60 * 1000
            },
            waitlist: p.waitlist!.slice(1)
          };
        }
        return p;
      }));
    }
  }, [activePotluck, dishCap, totalAttendees, activeFirstInLine, activeWaitlist, selectedPotluckId]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    
    setDishForms(prev => {
        const newForms = [...prev];
        newForms[index] = { ...newForms[index], [name]: value };
        return newForms;
    });
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setDishForms(prev => {
              const newForms = [...prev];
              newForms[index] = { ...newForms[index], imageUrl: reader.result as string };
              return newForms;
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddForm = () => {
      setDishForms(prev => [...prev, { ...initialFormState }]);
      setError(null);
  };

  const handleRemoveForm = (index: number) => {
      if (dishForms.length <= 1) return;
      setDishForms(prev => prev.filter((_, i) => i !== index));
      setError(null);
  };

  const handleStartEdit = (dish: Dish) => {
    if (!canModifyActivePotluck) return;
    setEditingDishId(dish.id);
    setDishForms([{
      dishName: dish.dishName,
      allergens: dish.allergens,
      extras: dish.extras || '',
      category: dish.category,
      imageUrl: dish.imageUrl || '',
      hasPlusOne: dish.hasPlusOne || false,
      plusOneName: dish.plusOneName || '',
      isParticipatingInCookieSwap: dish.isParticipatingInCookieSwap || false,
      cookieSwapDescription: dish.cookieSwapDescription || '',
      userDietaryRestrictions: dish.userDietaryRestrictions || '',
      isDietaryRestrictionSerious: dish.isDietaryRestrictionSerious || false,
    }]);
    setError(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingDishId(null);
    setDishForms([initialFormState]);
    setError(null);
  };

  const handleDeleteDish = (id: number) => {
    if (!canModifyActivePotluck) return;
    const dishToDelete = activeDishes.find(d => d.id === id);
    if (dishToDelete && window.confirm('Are you sure you want to delete this dish?')) {
        addLogEntry('deleted', `Removed dish: "${dishToDelete.dishName}"`);
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
    if (!canModifyActivePotluck) {
        setError("This potluck is now archived. Only admins can make changes.");
        return;
    }

    for (let i = 0; i < dishForms.length; i++) {
        const form = dishForms[i];
        const prefix = dishForms.length > 1 ? `Dish #${i + 1}: ` : '';
        if (!form.dishName.trim()) { setError(`${prefix}Dish name is required.`); return; }
        if (!form.allergens.trim()) { setError(`${prefix}Allergens field is required. Please write "N/A" if no major allergens are present.`); return; }
        if (form.hasPlusOne && !form.plusOneName.trim()) { setError(`${prefix}Please enter the name of your plus one.`); return; }
        if (form.isParticipatingInCookieSwap && !form.cookieSwapDescription.trim()) { setError(`${prefix}Please describe the cookies you are bringing for the swap.`); return; }
    }

    const currentAttendees = activeDishes.reduce((acc, dish) => dish.id === editingDishId ? acc : acc + 1 + (dish.hasPlusOne ? 1 : 0), 0);
    const newContribution = dishForms.reduce((acc, form) => acc + 1 + (form.hasPlusOne ? 1 : 0), 0);

    // Capacity cap check - admins can override
    if (!currentUser.isAdmin && dishCap !== undefined && (currentAttendees + newContribution) > dishCap) {
        setError(`This would exceed the capacity limit of ${dishCap} people. You are trying to add ${newContribution} spots.`);
        return;
    }

    // Logging
    if (editingDishId !== null) {
      addLogEntry('modified', `Updated dish: "${dishForms[0].dishName}"`);
    } else {
      const dishNames = dishForms.map(f => `"${f.dishName}"`).join(', ');
      addLogEntry('added', `Joined/Added dishes: ${dishNames}`);
    }

    // Capture user-level info from the first form to apply to all dishes in this entry
    const commonUserInfo = {
      userDietaryRestrictions: dishForms[0].userDietaryRestrictions,
      isDietaryRestrictionSerious: dishForms[0].isDietaryRestrictionSerious,
      hasPlusOne: dishForms[0].hasPlusOne,
      plusOneName: dishForms[0].plusOneName,
      isParticipatingInCookieSwap: dishForms[0].isParticipatingInCookieSwap,
      cookieSwapDescription: dishForms[0].cookieSwapDescription,
    };

    setPotlucks(prevPotlucks => prevPotlucks.map(p => {
        if (p.id !== selectedPotluckId) return p;
        let updatedDishes = [...p.dishes];
        let updatedFirstInLine = p.firstInLine;
        
        // If firstInLine joins, clear their spot
        if (isFirstInLineUser && editingDishId === null) {
          updatedFirstInLine = null;
        }

        if (editingDishId !== null) {
            updatedDishes = updatedDishes.map(dish => 
                dish.id === editingDishId ? { ...dish, ...dishForms[0] } : dish
            );
        } else {
            const newDishes = dishForms.map((form, index) => ({
                id: Date.now() + index,
                personName: currentUser.name,
                userId: currentUser.id,
                ...form,
                ...commonUserInfo
            }));
            updatedDishes = [...updatedDishes, ...newDishes];
        }
        return { ...p, dishes: updatedDishes, firstInLine: updatedFirstInLine };
    }));
    handleCancelEdit();
  };

  const handleJoinWaitlist = () => {
    if (!currentUser || isWaitlistFull || isOnWaitlist || !canModifyActivePotluck) return;

    addLogEntry('joined_waitlist', `Joined the waitlist for "${activePotluck?.name}"`);
    setPotlucks(prevPotlucks => prevPotlucks.map(p => {
      if (p.id !== selectedPotluckId) return p;
      const currentWaitlist = p.waitlist || [];
      if (currentWaitlist.length >= WAITLIST_MAX) return p;
      
      const newEntry: WaitlistEntry = {
        userId: currentUser.id,
        name: currentUser.name,
        timestamp: Date.now()
      };

      return { ...p, waitlist: [...currentWaitlist, newEntry] };
    }));
  };

  const handleLeaveWaitlist = (targetUserId?: string) => {
    if (!canModifyActivePotluck) return;
    const idToRemove = targetUserId || currentUser?.id;
    if (!idToRemove) return;
    
    const entry = activeWaitlist.find(e => e.userId === idToRemove);
    if (entry) {
      addLogEntry('left_waitlist', `Left/Removed from waitlist: ${entry.name}`);
    }

    setPotlucks(prevPotlucks => prevPotlucks.map(p => {
      if (p.id !== selectedPotluckId) return p;
      return { ...p, waitlist: (p.waitlist || []).filter(entry => entry.userId !== idToRemove) };
    }));
  };

  const handleGiveUpSpot = () => {
    if (!canModifyActivePotluck) return;
    if (activeFirstInLine) {
       addLogEntry('promoted', `Gave up/Removed First In Line spot: ${activeFirstInLine.name}`);
    }

    setPotlucks(prevPotlucks => prevPotlucks.map(p => {
      if (p.id !== selectedPotluckId) return p;
      const nextWaitlist = p.waitlist || [];
      const newFirst = nextWaitlist.length > 0 ? {
        ...nextWaitlist[0],
        expiryTimestamp: Date.now() + RESERVATION_HOURS * 60 * 60 * 1000
      } : null;
      return { ...p, firstInLine: newFirst, waitlist: nextWaitlist.slice(1) };
    }));
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleAdminClick = () => {
    if (currentUser?.isAdmin) { setIsAdminModalOpen(true); return; }
    const password = prompt('Enter admin password:');
    if (password === 'p1gg135') {
      if (currentUser) {
          const adminUser = { ...currentUser, isAdmin: true };
          setCurrentUser(adminUser);
          localStorage.setItem('cvcc_user', JSON.stringify(adminUser));
          setIsAdminModalOpen(true);
          addLogEntry('promoted', `Unlocked Admin Panel`);
      }
    } else if (password !== null) { alert('Incorrect password.'); }
  };

  const handleLogoutAdmin = () => {
    if (currentUser) {
        const nonAdminUser = { ...currentUser, isAdmin: false };
        setCurrentUser(nonAdminUser);
        localStorage.setItem('cvcc_user', JSON.stringify(nonAdminUser));
        setIsAdminModalOpen(false);
        addLogEntry('deleted', `Admin privileges revoked`);
    }
  };

  const handleAddPotluck = (potluckData: Omit<Potluck, 'id' | 'dishes'>) => {
    const newPotluck: Potluck = { id: Date.now(), ...potluckData, dishes: [], waitlist: [], firstInLine: null };
    setPotlucks(prev => [...prev, newPotluck]);
    setSelectedPotluckId(newPotluck.id); 
    addLogEntry('added', `Created new potluck event: "${potluckData.name}"`);
  };

  const handleDeletePotluck = (id: number) => {
    const p = potlucks.find(pot => pot.id === id);
    setPotlucks(prev => {
      const newPotlucks = prev.filter(p => p.id !== id);
      if (selectedPotluckId === id) setSelectedPotluckId(newPotlucks[0]?.id || -1);
      return newPotlucks;
    });
    if (p) addLogEntry('deleted', `Deleted potluck event: "${p.name}"`);
  };

  const handleEditPotluck = (id: number, potluckData: Partial<Omit<Potluck, 'id' | 'dishes'>>) => {
    setPotlucks(prev => prev.map(p => (p.id === id ? { ...p, ...potluckData } : p)));
    addLogEntry('modified', `Updated potluck details: "${potluckData.name}"`);
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentUser) return <LoginScreen onJoin={handleJoin} />;

  const canAddDish = canModifyActivePotluck && (!isFull || isFirstInLineUser || editingDishId !== null || currentUser?.isAdmin);

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
            <PotluckMenu potlucks={potlucks} selectedPotluckId={selectedPotluckId} onSelectPotluck={setSelectedPotluckId} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800">Chicago Vegan Cookbook Club</h1>
          <p className="text-lg text-gray-600 mt-2 font-medium">{activePotluck?.name ?? 'Monthly Potluck'}</p>
           {activePotluck && (
            <div className="mt-4 text-sm text-gray-600 flex flex-col items-center gap-y-1">
                <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center sm:gap-x-6 gap-y-1">
                    {activePotluck.bookTheme && <p><strong>Theme:</strong> {activePotluck.bookTheme}</p>}
                    {activePotluck.host && <p><strong>Host:</strong> {activePotluck.host}</p>}
                    {activePotluck.neighborhood && <p><strong>Neighborhood:</strong> {activePotluck.neighborhood}</p>}
                    {activePotluck.date && <p><strong>Date:</strong> {activePotluck.date}</p>}
                    {activePotluck.time && <p><strong>Time:</strong> {activePotluck.time}</p>}
                </div>
                
                {(activePotluck.buyBookLink || activePotluck.authorWebsiteLink || activePotluck.cplLink) && (
                    <div className="flex flex-wrap justify-center gap-4 mt-3 py-2 border-t border-gray-100 w-full max-w-lg">
                        {activePotluck.buyBookLink && (
                            <a href={activePotluck.buyBookLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-100 transition-colors font-semibold shadow-sm">
                                <span>📚</span> Buy the Book
                            </a>
                        )}
                        {activePotluck.authorWebsiteLink && (
                            <a href={activePotluck.authorWebsiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 transition-colors font-semibold shadow-sm">
                                <span>🌐</span> Author Website
                            </a>
                        )}
                        {activePotluck.cplLink && (
                            <a href={activePotluck.cplLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 transition-colors font-semibold shadow-sm">
                                <span>🏙️</span> View on CPL
                            </a>
                        )}
                    </div>
                )}

                {activePotluck.enableCookieSwap && (
                    <p className="font-semibold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 mt-2 shadow-sm animate-pulse-subtle">
                        🍪 {cookieSwapParticipants} participating in CBC Holiday Cookie Swap
                    </p>
                )}
            </div>
          )}
        </header>

        <main>
          {/* Admin Activity Log - Visible only to Admins */}
          {currentUser.isAdmin && (
            <ActivityLog entries={activityLog} />
          )}

          {/* Locked Status Banner */}
          {isPotluckLocked && (
              <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 mb-6 flex items-center justify-center gap-3 animate-fadeIn">
                  <span className="text-2xl">🔒</span>
                  <div className="text-center">
                      <p className="font-bold text-gray-700 uppercase tracking-wide">Archived Potluck</p>
                      <p className="text-xs text-gray-500">24 hours have passed since the event start. Modifications are now disabled for members.</p>
                  </div>
              </div>
          )}

          {/* Celebratory Countdown Timer */}
          <CountdownTimer date={activePotluck?.date} time={activePotluck?.time} />

          {/* First In Line Section */}
          {activeFirstInLine && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 sm:p-8 rounded-xl shadow-lg mb-8 border-2 border-amber-200 animate-fadeIn relative overflow-hidden">
               <div className="absolute top-0 right-0 px-4 py-1 bg-amber-200 text-amber-800 text-xs font-bold rounded-bl-lg uppercase tracking-wider">
                  Spot Reserved
               </div>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl" role="img" aria-label="priority">🌟</span>
                      <h2 className="text-2xl font-bold text-amber-900">First In Line</h2>
                    </div>
                    <p className="text-amber-800 font-medium text-lg">
                      {activeFirstInLine.name} {activeFirstInLine.userId === currentUser.id && <span className="text-amber-600 font-black">(You!)</span>}
                    </p>
                  </div>
                  
                  <div className="bg-white/80 p-3 rounded-lg border border-amber-100 shadow-sm text-center min-w-[140px]">
                    <span className="block text-xs text-amber-600 font-bold uppercase mb-1">Time Remaining</span>
                    <span className="text-2xl font-mono font-black text-amber-700">
                      {formatTime(activeFirstInLine.expiryTimestamp - currentTime)}
                    </span>
                  </div>
               </div>

               {(activeFirstInLine.userId === currentUser.id || currentUser.isAdmin) && (
                 <div className="mt-6 flex flex-wrap gap-4">
                    {activeFirstInLine.userId === currentUser.id && canModifyActivePotluck && (
                        <button 
                          onClick={handleScrollToForm}
                          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
                        >
                          <span className="text-xl">🥗</span> Join Potluck
                        </button>
                    )}
                    <button 
                      onClick={handleGiveUpSpot}
                      disabled={!canModifyActivePotluck}
                      className={`px-6 py-3 bg-white font-bold rounded-lg transition-all active:scale-95 border-2 disabled:opacity-50 disabled:cursor-not-allowed ${currentUser.isAdmin && activeFirstInLine.userId !== currentUser.id ? 'text-orange-600 border-orange-100 hover:bg-orange-50' : 'text-red-600 border-red-100 hover:bg-red-50'}`}
                    >
                      {currentUser.isAdmin && activeFirstInLine.userId !== currentUser.id ? 'Remove User' : 'Give Up Spot'}
                    </button>
                 </div>
               )}
            </div>
          )}

          {/* Waitlist Section */}
          {isFull && activePotluck && (
            <div className="bg-indigo-50 p-6 sm:p-8 rounded-xl shadow-md mb-8 border border-indigo-100 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label="waitlist">📋</span>
                  <h2 className="text-2xl font-semibold text-indigo-900">Waitlist</h2>
                </div>
                <div className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200 font-medium">
                  {activeWaitlist.length} / {WAITLIST_MAX} Spots
                </div>
              </div>
              
              <p className="text-sm text-indigo-700 mb-6 italic">
                This potluck is currently at capacity. Join the waitlist to be next in line if a spot opens up!
              </p>

              <div className="space-y-3 mb-6">
                {activeWaitlist.length > 0 ? (
                  <ol className="list-decimal list-inside space-y-2">
                    {activeWaitlist.sort((a, b) => a.timestamp - b.timestamp).map((entry, idx) => (
                      <li key={entry.userId} className={`p-2 rounded-md bg-white border border-indigo-100 shadow-sm flex justify-between items-center ${entry.userId === currentUser.id ? 'ring-2 ring-indigo-400 ring-opacity-50' : ''}`}>
                        <span className="text-gray-800 font-medium ml-2">
                          {entry.name} {entry.userId === currentUser.id && <span className="text-xs text-indigo-500 font-bold ml-1">(You)</span>}
                        </span>
                        {(entry.userId === currentUser.id || currentUser.isAdmin) && (
                          <button 
                            onClick={() => handleLeaveWaitlist(entry.userId)} 
                            disabled={!canModifyActivePotluck}
                            className={`text-xs font-bold px-2 py-1 rounded border transition-colors disabled:opacity-50 ${currentUser.isAdmin && entry.userId !== currentUser.id ? 'text-orange-600 border-orange-100 hover:bg-orange-50' : 'text-red-500 border-red-100 hover:bg-red-50'}`}>
                            {currentUser.isAdmin && entry.userId !== currentUser.id ? 'Remove' : 'Leave'}
                          </button>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-center text-indigo-400 py-4 bg-white/50 rounded-lg border border-dashed border-indigo-200">
                    Waitlist is empty.
                  </p>
                )}
              </div>

              {!isOnWaitlist && !isWaitlistFull && !isFirstInLineUser && canModifyActivePotluck && (
                <button 
                  onClick={handleJoinWaitlist}
                  className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
                >
                  Join Waitlist
                </button>
              )}
              {isWaitlistFull && !isOnWaitlist && (
                <p className="text-center text-sm text-indigo-400 font-medium">
                  The waitlist is currently full.
                </p>
              )}
              {isPotluckLocked && !currentUser?.isAdmin && (
                  <p className="text-center text-sm text-gray-400 font-medium">
                      Waitlist management is closed for this archived potluck.
                  </p>
              )}
            </div>
          )}

          <div ref={formRef} className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8 scroll-mt-4 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                {editingDishId ? 'Edit Dish' : 'Add Dish(es)'}
                </h2>
                <div className="text-sm bg-green-50 text-green-800 px-3 py-1 rounded-full border border-green-100">
                    Posting as: <strong>{currentUser.name}</strong>
                </div>
            </div>

            {dishCap && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                    <span>Potluck Capacity (People)</span>
                    <span className={isFull ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {totalAttendees} / {dishCap} filled
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 transition-all duration-500 ${isFull ? 'bg-red-500' : totalAttendees >= dishCap * 0.8 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                      style={{ width: `${Math.min(100, (totalAttendees / dishCap) * 100)}%` }}
                    ></div>
                  </div>
                  {isFull && !editingDishId && !isFirstInLineUser && !currentUser.isAdmin && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                          This potluck is currently at capacity. Join the waitlist to be next in line if a spot opens up!
                      </p>
                  )}
                  {isFull && currentUser.isAdmin && (
                    <p className="text-green-600 text-sm mt-2 font-bold animate-pulse-subtle">
                        👑 Administrator: Capacity override enabled.
                    </p>
                  )}
                  {isFirstInLineUser && isFull && (
                    <p className="text-amber-600 text-sm mt-2 font-bold animate-pulse">
                      🌟 You have priority! You can add a dish to claim the open spot.
                    </p>
                  )}
                </div>
            )}
            
            <fieldset disabled={!canAddDish} className="group disabled:opacity-60">
                <form onSubmit={handleSubmit} className="space-y-6">
                
                {isPotluckLocked && !currentUser?.isAdmin ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">This potluck is locked. No new dishes can be added.</p>
                    </div>
                ) : dishForms.map((formData, index) => (
                    <div key={index} className={dishForms.length > 1 ? "p-4 border border-gray-200 rounded-lg bg-gray-50/50 shadow-sm relative animate-fadeIn" : ""}>
                        {dishForms.length > 1 && (
                            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                                <h3 className="font-medium text-gray-700">Dish #{index + 1}</h3>
                                <button type="button" onClick={() => handleRemoveForm(index)} className="text-red-500 text-sm hover:text-red-700 flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">
                                    <span className="text-lg leading-none">&times;</span> Remove
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                <label htmlFor={`dishName-${index}`} className="block text-sm font-medium text-gray-600 mb-1">Dish Name</label>
                                <input type="text" id={`dishName-${index}`} name="dishName" value={formData.dishName} onChange={(e) => handleInputChange(index, e)} placeholder="e.g., Spicy Black Bean Burgers" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                </div>
                                <div>
                                    <label htmlFor={`category-${index}`} className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                                    <select id={`category-${index}`} name="category" value={formData.category} onChange={(e) => handleInputChange(index, e)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white" >
                                    {CATEGORIES.map(category => (<option key={category} value={category}>{category}</option>))}
                                    </select>
                                </div>
                            </div>

                            {index === 0 && (
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-lg">
                                    <label htmlFor={`userDietaryRestrictions-${index}`} className="block text-sm font-bold text-blue-800 mb-1">Your Allergies or Additional Dietary Restrictions</label>
                                    <input
                                        type="text"
                                        id={`userDietaryRestrictions-${index}`}
                                        name="userDietaryRestrictions"
                                        value={formData.userDietaryRestrictions}
                                        onChange={(e) => handleInputChange(index, e)}
                                        placeholder="e.g. Peanut allergy, Gluten-free only"
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    />
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`isDietaryRestrictionSerious-${index}`}
                                            name="isDietaryRestrictionSerious"
                                            checked={formData.isDietaryRestrictionSerious}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                                        />
                                        <label htmlFor={`isDietaryRestrictionSerious-${index}`} className="text-sm font-bold text-red-800 cursor-pointer flex items-center gap-1">
                                            this allergy or restriction is EXTRA serious 💀
                                        </label>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-1 italic">This will appear next to your name on all dishes you bring.</p>
                                </div>

                                <div className="border-t border-b border-gray-100 py-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <input type="checkbox" id={`hasPlusOne-${index}`} name="hasPlusOne" checked={formData.hasPlusOne} onChange={(e) => handleInputChange(index, e)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer" />
                                        <label htmlFor={`hasPlusOne-${index}`} className="text-sm font-medium text-gray-700 cursor-pointer">Bringing a +1?</label>
                                    </div>
                                    {formData.hasPlusOne && (
                                        <div className="ml-6 animate-fadeIn">
                                            <label htmlFor={`plusOneName-${index}`} className="block text-sm font-medium text-gray-600 mb-1">Plus One Name</label>
                                            <input type="text" id={`plusOneName-${index}`} name="plusOneName" value={formData.plusOneName} onChange={(e) => handleInputChange(index, e)} placeholder="e.g., Partner's Name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                        </div>
                                    )}
                                </div>

                                {activePotluck?.enableCookieSwap && (
                                    <div className="border-t border-b border-gray-100 py-3 bg-yellow-50/50 rounded-md px-2 my-2 border border-yellow-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <input type="checkbox" id={`isParticipatingInCookieSwap-${index}`} name="isParticipatingInCookieSwap" checked={formData.isParticipatingInCookieSwap} onChange={(e) => handleInputChange(index, e)} className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer" />
                                            <label htmlFor={`isParticipatingInCookieSwap-${index}`} className="text-sm font-bold text-yellow-800 cursor-pointer">Participating in the CBC Holiday Cookie Swap? 🍪</label>
                                        </div>
                                        {formData.isParticipatingInCookieSwap && (
                                            <div className="ml-6 animate-fadeIn">
                                                <label htmlFor={`cookieSwapDescription-${index}`} className="block text-sm font-medium text-gray-600 mb-1">What type of cookies are you bringing?</label>
                                                <input type="text" id={`cookieSwapDescription-${index}`} name="cookieSwapDescription" value={formData.cookieSwapDescription} onChange={(e) => handleInputChange(index, e)} placeholder="e.g., Gingerbread Men" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            )}

                            <div>
                                <label htmlFor={`allergens-${index}`} className="block text-sm font-medium text-gray-600 mb-1">Dish-Specific Major Allergens</label>
                                <input type="text" id={`allergens-${index}`} name="allergens" value={formData.allergens} onChange={(e) => handleInputChange(index, e)} placeholder="e.g., Nuts, Soy" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                <p className="text-xs text-gray-500 mt-1">Write "N/A" if no major allergens present in this specific dish.</p>
                            </div>

                            <div>
                                <label htmlFor={`extras-${index}`} className="block text-sm font-medium text-gray-600 mb-1">Any Extras (optional)</label>
                                <input type="text" id={`extras-${index}`} name="extras" value={formData.extras || ''} onChange={(e) => handleInputChange(index, e)} placeholder="e.g., Serving spoons" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                            </div>

                            <div>
                                <label htmlFor={`imageUrl-${index}`} className="block text-sm font-medium text-gray-600 mb-1">Dish Image (optional)</label>
                                <input type="file" id={`imageUrl-${index}`} name="imageUrl" accept="image/*" onChange={(e) => handleImageChange(index, e)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                                {formData.imageUrl && <div className="mt-4"><img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md border border-gray-200" /></div>}
                            </div>
                        </div>
                    </div>
                ))}

                <p className="text-sm text-red-600 font-medium">
                    REMINDER: Please ensure all dishes are 100% Vegan 🌱
                </p>

                {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                     {!editingDishId && canAddDish && (
                        <button type="button" onClick={handleAddForm} className="text-green-600 font-medium hover:text-green-800 flex items-center gap-1 text-sm py-2 px-4 rounded-md border border-green-200 bg-green-50 hover:bg-green-100 transition-colors w-full sm:w-auto justify-center">
                            <span className="text-lg leading-none font-bold">+</span> Add Another Dish
                        </button>
                    )}
                    
                    <div className="flex gap-4 w-full sm:w-auto justify-end ml-auto">
                        {editingDishId && (
                        <button type="button" onClick={handleCancelEdit} className="py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
                        )}
                        <button type="submit" disabled={!canAddDish} className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-colors w-full sm:w-auto ${!canAddDish ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}>
                        {editingDishId ? 'Update Dish' : `Add ${dishForms.length > 1 ? 'Dishes' : 'Dish'}`}
                        </button>
                    </div>
                </div>
                </form>
            </fieldset>
          </div>

          <CategoryChart dishes={activeDishes} />
          
          <DietaryRestrictionsChart dishes={activeDishes} />

          <DishList 
            dishes={activeDishes} 
            currentUserId={currentUser.id} 
            isAdmin={currentUser.isAdmin} 
            isPotluckLocked={isPotluckLocked}
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
        onLogoutAdmin={handleLogoutAdmin}
      />
    </div>
  );
};

export default App;
