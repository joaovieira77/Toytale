import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get current user ID
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`http://localhost:3032/api/items/${itemId}`)
      .then(res => res.json())
      .then(data => {
        setItem(data);
        if (data.ownerId) {
          return fetch(`http://localhost:3032/api/users/${data.ownerId}`);
        }
        return null;
      })
      .then(res => res ? res.json() : null)
      .then(sellerData => {
        if (sellerData) setSeller(sellerData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar item:", err.message);
        setLoading(false);
      });
  }, [itemId]);

  const handleContact = () => {
    if (item?.ownerId) {
      navigate(`/messages/${item.ownerId}`);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page (you'll need to create this)
    navigate(`/edit-item/${itemId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`http://localhost:3032/api/items/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          alert("Item deleted successfully!");
          navigate('/home');
        } else {
          alert("Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item");
      }
    }
  };

  // Check if current user is the owner
  const isOwner = currentUserId === item?.ownerId;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Item not found.</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 text-blue-600 underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Logo */}
      <div className="sticky top-0 z-50 w-full bg-white pt-5 pb-4 shadow-lg border-b border-gray-100">
        <div className="flex items-center justify-center">
          <img src="/toytalelogo.png" alt="Toytale Logo" className="h-14 md:h-20 object-contain" />
        </div>
      </div>
      
      <div className="p-6 flex flex-col items-center flex-1">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full border border-gray-100">
          
          {/* Seller Information - Moved to top */}
          {seller && (
            <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                
                Seller Information
              </h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  {/* Profile Picture */}
                  <img
                    src={seller.profileImage || "/purple-butterfly.jpg"}
                    alt="Seller Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
                  />
                  {/* Seller Details */}
                  <div className="space-y-2">
                    <p className="text-gray-700 text-lg">
                      <span className="font-semibold text-gray-800">Name:</span>{" "}
                      {seller.name || `${seller.firstName || ''} ${seller.lastName || ''}`.trim()}
                    </p>
                    {seller.location && (
                      <p className="text-gray-600 flex items-center">
                        <span className="font-medium">Location:</span>
                        <span className="ml-1">{seller.location}</span>
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/profile/${seller._id}`)}
                  className="bg-[#278d80] text-white px-6 py-3 rounded-xl hover:bg-[#1e6b61] transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  View Profile
                </button>
              </div>
            </div>
          )}

          {/* Item Image */}
          {item.photoUrl ? (
            <img 
              src={item.photoUrl} 
              alt={item.title} 
              className="w-full h-80 object-cover rounded-xl mb-6 shadow-md" 
            />
          ) : (
            <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-8xl rounded-xl mb-6 shadow-inner">
              {item.type === 'toy' ? '🧸' : '📚'}
            </div>
          )}
          
          {/* Item Details */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 leading-tight">{item.title}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {item.type?.charAt(0).toUpperCase() + item.type?.slice(1).toLowerCase()}
              </span>
              <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
              </span>
              <span className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                Age {item.ageRange}
              </span>
              <span className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {item.mode === 'buy' ? 'For Sale' : item.mode.charAt(0).toUpperCase() + item.mode.slice(1)}
              </span>
              {item.price && item.mode === 'buy' && (
                <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  €{item.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            {isOwner ? (
              // Show Edit/Delete buttons for item owner
              <>
                <button
                  onClick={handleEdit}
                  className="bg-[#278d80] text-white px-6 py-3 rounded-xl hover:bg-[#1e6b61] transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Edit Item
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Delete Item
                </button>
              </>
            ) : (
              // Show Message Seller button for other users
              <button
                onClick={handleContact}
                className="bg-[#278d80] text-white px-6 py-3 rounded-xl hover:bg-[#1e6b61] transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Message Seller
              </button>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              className="text-[#278d80] hover:text-[#1e6b61] underline text-sm font-medium transition-colors duration-200 flex items-center justify-center mx-auto"
              onClick={() => navigate('/home')}
            >
              <span className="mr-1">←</span>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
