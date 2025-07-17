import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [activeView, setActiveView] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const filterRef = useRef();
  const navigate = useNavigate();

  const ageGroups = ['0-2', '3-5', '6-8', '9-12', '13-18'];
  const offerTypes = ['Donation', 'Trade', 'Sale'];

  useEffect(() => {
    fetch("http://localhost:3032/api/items")
      .then(res => res.json())
      .then(data => {
        // Sort items in chronological order (newest first)
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.dateAdded || 0);
          const dateB = new Date(b.createdAt || b.dateAdded || 0);
          return dateB - dateA; // Newest first
        });
        setItems(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar itens:", err.message);
        setItems([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterMenu(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter(item => {
    // Search filter - check title and description
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(query);
      const descriptionMatch = item.description?.toLowerCase().includes(query);
      if (!titleMatch && !descriptionMatch) return false;
    }
    
    if (activeView === 'TOYS' && item.type !== 'toy') return false;
    if (activeView === 'BOOKS' && item.type !== 'book') return false;
    
    // Age filter - handle different dash types
    if (selectedAge) {
      const normalizedSelectedAge = selectedAge.replace('–', '-');
      const normalizedItemAge = item.ageRange?.replace('–', '-');
      if (normalizedItemAge !== normalizedSelectedAge) return false;
    }
    
    // Offer type filter - handle different modes
    if (selectedOffer) {
      const selectedMode = selectedOffer.toLowerCase();
      let itemMode = item.mode?.toLowerCase();
      
      // Convert 'buy' to 'sale' for comparison
      if (itemMode === 'buy') itemMode = 'sale';
      
      if (itemMode !== selectedMode) return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading Toytale items...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center">
      {/* Header */}
      <div className="sticky top-0 z-50 w-screen bg-white pt-5 pb-4 shadow-md">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <img src="/toytalelogo.png" alt="Toytale Logo" className="h-14 md:h-20 object-contain" />
          </div>

          <div className="flex items-center space-x-3 justify-center relative">
            <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="Search for toys, books, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#278d80] focus:border-[#278d80]"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <img 
                src="/filter.png"
                alt="Filter"
                className="h-8 w-10 cursor-pointer"
                onClick={() => {
                  setShowFilterMenu(prev => !prev);
                  setActiveCategory(null);
                }}
              />

              {showFilterMenu && !activeCategory && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => setActiveCategory('Age Group')}>Age Group</div>
                  <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => setActiveCategory('Offer Type')}>Offer Type</div>
                  <div className="px-4 pt-2 w-full text-right">
                    <button className="text-gray-500 text-xs font-medium hover:underline" onClick={() => {
                      setSelectedAge(null);
                      setSelectedOffer(null);
                    }}>
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}

              {showFilterMenu && activeCategory === 'Age Group' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-50">
                  {ageGroups.map(age => (
                    <div key={age} onClick={() => setSelectedAge(age)} className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedAge === age ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600'}`}>
                      {age}
                    </div>
                  ))}
                  <div className="flex justify-between px-4 pt-2 space-x-2">
                    <button onClick={() => { setShowFilterMenu(false); setActiveCategory(null); }} className="text-blue-500 text-sm hover:underline">Save</button>
                    <button onClick={() => { setSelectedAge(null); setShowFilterMenu(false); setActiveCategory(null); }} className="text-red-500 text-sm hover:underline">Cancel</button>
                    <button onClick={() => { setSelectedAge(null); }} className="text-gray-500 text-sm hover:underline">Clear</button>
                  </div>
                </div>
              )}

              {showFilterMenu && activeCategory === 'Offer Type' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-50">
                  {offerTypes.map(type => (
                    <div key={type} onClick={() => setSelectedOffer(type)} className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedOffer === type ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600'}`}>
                      {type}
                    </div>
                  ))}
                  <div className="flex justify-between px-4 pt-2 space-x-2">
                    <button onClick={() => { setShowFilterMenu(false); setActiveCategory(null); }} className="text-blue-500 text-sm hover:underline">Save</button>
                    <button onClick={() => { setSelectedOffer(null); setShowFilterMenu(false); setActiveCategory(null); }} className="text-red-500 text-sm hover:underline">Cancel</button>
                    <button onClick={() => { setSelectedOffer(null); }} className="text-gray-500 text-sm hover:underline">Clear</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex space-x-3 mb-6 mt-4">
        <button onClick={() => setActiveView('ALL')} className={`px-4 py-2 rounded-full ${activeView === 'ALL' ? 'bg-[#278d80] text-white' : 'bg-gray-100 text-gray-800'}`}>All</button>
        <button onClick={() => setActiveView('TOYS')} className={`px-4 py-2 rounded-full ${activeView === 'TOYS' ? 'bg-[#278d80] text-white' : 'bg-gray-100 text-gray-800'}`}>Toys</button>
        <button onClick={() => setActiveView('BOOKS')} className={`px-4 py-2 rounded-full ${activeView === 'BOOKS' ? 'bg-[#278d80] text-white' : 'bg-gray-100 text-gray-800'}`}>Books</button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-2 pb-20">
        {filteredItems.map(item => (
          <div 
            key={item._id} 
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col space-y-3 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer transform"
            onClick={() => navigate(`/item/${item._id}`)}
          >
            {item.photoUrl ? (
              <img src={item.photoUrl} alt={item.title} className="w-full h-64 object-cover rounded-xl" />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-6xl rounded-xl">
                {item.type === 'toy' ? '🧸' : '📚'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
              </span>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                {item.ageRange}
              </span>
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                {item.mode === 'buy' ? 'Sale' : item.mode.charAt(0).toUpperCase() + item.mode.slice(1)}
              </span>
              {item.price && item.mode === 'buy' && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  €{item.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer & Nav */}
      <NavBar />
   
    </div>
  );
}
