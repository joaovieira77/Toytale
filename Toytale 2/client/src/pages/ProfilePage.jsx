import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [childrenCount, setChildrenCount] = useState(0);
  const [children, setChildren] = useState([]);
  const [items, setItems] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/auth");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3032/api/users/${userId}`);
        const userData = await res.json();
        console.log("User data received:", JSON.stringify(userData, null, 2)); // Debug log
        console.log("User data keys:", Object.keys(userData)); // Debug log
        setUser(userData);
        
        // Set form states with better fallbacks
        // Handle legacy 'name' field vs separate firstName/lastName
        if (userData.firstName && userData.lastName) {
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        } else if (userData.name && userData.name !== null) {
          // Split legacy name field
          const nameParts = userData.name.split(' ');
          setFirstName(nameParts[0] || '');
          setLastName(nameParts.slice(1).join(' ') || '');
        } else {
          setFirstName('');
          setLastName('');
        }
        
        setLocation(userData.location || '');
        setEmail(userData.email || '');
        setBio(userData.bio || '');
        setChildren(userData.childrenAges && userData.childrenAges !== null ? userData.childrenAges : []);
        setChildrenCount(userData.childrenAges && userData.childrenAges !== null ? userData.childrenAges.length : 0);
        setProfileImage(userData.profileImage || '');
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err.message);
        setLoading(false);
      }
    };

    const fetchUserItems = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`http://localhost:3032/api/items`);
        const allItems = await res.json();
        const userItems = allItems.filter(item => item.ownerId === userId);
        
        // Sort items in chronological order (newest first)
        const sortedUserItems = userItems.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.dateAdded || 0);
          const dateB = new Date(b.createdAt || b.dateAdded || 0);
          return dateB - dateA; // Newest first
        });
        
        setItems(sortedUserItems);
      } catch (err) {
        console.error("Error fetching items:", err.message);
      }
    };

    fetchUser();
    fetchUserItems();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Auto-save the profile image immediately
      saveProfileImage(file);
    }
  };

  const saveProfileImage = async (file) => {
    try {
      const reader = new FileReader();
      const imageUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const res = await fetch("http://localhost:3032/api/users/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          profileImage: imageUrl
        }),
      });

      if (!res.ok) throw new Error("Error updating profile image");

      setUser(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
      
      setImageFile(null);
    } catch (err) {
      console.error("Error saving profile image:", err.message);
    }
  };

  const handleChildrenCountChange = (count) => {
    setChildrenCount(count);
    const newChildren = Array.from({ length: count }, (_, index) => 
      children[index] || { age: '', gender: '' }
    );
    setChildren(newChildren);
  };

  const handleChildChange = (index, field, value) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
  };

  const handleSave = async () => {
    try {
      let imageUrl = profileImage;
      
      // If a new image file was selected, convert to base64
      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(imageFile);
        });
      }

      const res = await fetch("http://localhost:3032/api/users/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          firstName,
          lastName,
          location,
          email,
          bio,
          childrenAges: children,
          profileImage: imageUrl
        }),
      });

      if (!res.ok) throw new Error("Error updating profile");

      setUser(prev => ({
        ...prev,
        firstName,
        lastName,
        location,
        email,
        bio,
        childrenAges: children,
        profileImage: imageUrl
      }));
      
      setShowEditForm(false);
      setImageFile(null);
    } catch (err) {
      console.error("Error saving profile:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/auth");
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
            src={profileImage || user.profileImage || "/purple-butterfly.jpg"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mr-8"
          />
          <label className="absolute bottom-0 right-6 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </label>
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
            onClick={() => setShowEditForm(true)}
            className="mt-3 px-4 py-2 text-sm font-medium text-white rounded hover:opacity-90 self-start"
            style={{ backgroundColor: '#278d80' }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <div className="px-4 py-6 border-t space-y-4">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="First Name" 
                className="w-1/2 px-3 py-2 border rounded-lg"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                className="w-1/2 px-3 py-2 border rounded-lg"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <input 
              type="text" 
              placeholder="Location" 
              className="w-full px-3 py-2 border rounded-lg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full px-3 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              placeholder="Bio"
              className="w-full px-3 py-2 border rounded-lg h-20 resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            {/* Number of Children Instruction + Input */}
            <label className="block text-sm font-medium text-gray-700">
              Please enter the number of children to configure age and gender fields
            </label>
            <input
              type="number"
              placeholder="Number of Children"
              className="w-full px-3 py-2 border rounded-lg mt-1"
              value={childrenCount}
              onChange={(e) => handleChildrenCountChange(parseInt(e.target.value || '0'))}
              min="0"
              max="10"
            />

            {/* Dynamic Children Fields */}
            {Array.from({ length: childrenCount }, (_, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="number"
                  placeholder={`Child ${index + 1} Age`}
                  className="w-1/2 px-3 py-2 border rounded-lg"
                  value={children[index]?.age || ''}
                  onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                  min="0"
                  max="18"
                />
                <select 
                  className="w-1/2 px-3 py-2 border rounded-lg"
                  value={children[index]?.gender || ''}
                  onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ))}

            <div className="flex space-x-2">
              <button
                type="submit"
                className="w-full py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#278d80' }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Items */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-semibold mb-4">My Items</h3>
        <div className="grid grid-cols-2 gap-4">
          {items.length > 0 ? items.map(item => (
            <div 
              key={item._id} 
              className="bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
              onClick={() => navigate(`/item/${item._id}`)}
            >
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

      {/* Logout Button */}
      <div className="px-4 py-6 border-t text-center">
        <button 
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
      <NavBar />
    </div>
  );
}
