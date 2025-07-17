import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3032/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserItems = async () => {
      try {
        const res = await fetch(`http://localhost:3032/api/items`);
        const allItems = await res.json();
        const userItems = allItems.filter(item => item.ownerId === userId);
        setItems(userItems);
      } catch (err) {
        console.error("Error fetching items:", err.message);
      }
    };

    fetchUser();
    fetchUserItems();
  }, [userId]);

  const handleMessageUser = () => {
    if (userId) {
      navigate(`/messages/${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-md rounded-xl overflow-hidden pb-16">
      
      {/* Header with Logo */}
      <div className="sticky top-0 z-50 w-full bg-white pt-5 pb-4 shadow-md">
        <div className="flex items-center justify-center">
          <img src="/toytalelogo.png" alt="Toytale Logo" className="h-14 md:h-20 object-contain" />
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-row items-center py-6 bg-[#f5f5f5]">
        <div className="relative ml-10">
          <img
            src={user.profileImage || "/purple-butterfly.jpg"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mr-8"
          />
        </div>
        <div className="flex flex-col ml-4 flex-1">
          <h2 className="text-xl font-semibold">
            {(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : 
             (user.name && user.name !== null) ? user.name :
             `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
             'No name set'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{user.email || 'No email set'}</p>
          <p className="mt-1 text-sm text-gray-500">{(user.location && user.location !== null) ? user.location : 'No location set'}</p>
          {(user.bio && user.bio !== null) && <p className="mt-1 text-sm text-gray-600">{user.bio}</p>}
          <p className="mt-1 text-xs text-gray-500">
            {(user.childrenAges && user.childrenAges !== null && user.childrenAges.length > 0) ? 
             `${user.childrenAges.length} child${user.childrenAges.length > 1 ? 'ren' : ''}` : 
             'No children listed'}
          </p>
          <button
            onClick={handleMessageUser}
            className="mt-3 px-4 py-2 text-sm font-medium text-white rounded hover:opacity-90 self-start"
            style={{ backgroundColor: '#278d80' }}
          >
            Message User
          </button>
        </div>
      </div>

      {/* User's Items */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-semibold mb-4">
          {user.firstName ? `${user.firstName}'s Items` : 
           user.name ? `${user.name.split(' ')[0]}'s Items` : 
           'Their Items'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {items.length > 0 ? items.map(item => (
            <div key={item._id} className="bg-gray-100 rounded-xl overflow-hidden shadow-sm">
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.title} className="w-full h-24 object-cover rounded-t-xl" />
              ) : (
                <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-2xl rounded-t-xl">
                  {item.type === 'toy' ? '🧸' : '📚'}
                </div>
              )}
              <div className="p-3">
                <h4 className="text-sm font-medium">{item.title}</h4>
              </div>
            </div>
          )) : (
            <p className="col-span-2 text-gray-500 text-center">No items yet</p>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
}
