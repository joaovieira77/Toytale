import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';

const CharityPage = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: 'toy',
    condition: 'good',
    ngo: '',
    donorName: '',
    donorEmail: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const NGOs = [
    "Toys for Tots Foundation",
    "Books for All NGO",
    "Happy Kids Charity",
    "Local Community School",
    "Children's Hope International"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Donation submitted:', formData);
      setSubmitSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header with Logo */}
        <div className="sticky top-0 z-50 w-full bg-white pt-5 pb-4 shadow-lg border-b border-gray-100">
          <div className="flex items-center justify-center">
            <img src="/toytalelogo.png" alt="Toytale Logo" className="h-14 md:h-20 object-contain" />
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Donation Submitted!</h2>
            <p className="mb-4">Thank you for your generosity.</p>
            <button
              onClick={() => setSubmitSuccess(false)}
              style={{ backgroundColor: "#278d82" }}
              className="text-white px-4 py-2 rounded hover:opacity-80"
            >
              Donate Another Item
            </button>
          </div>
        </div>
        
        <Navbar />
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
      
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
                 <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "#278d82" }}
        >
          Be the reason someone smiles
        </h1>
          <p className="text-gray-600">
            Give your pre-loved items to organizations that need them most
          </p>
        </div>

        {/* Donation Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Name */}
              <div>
                <label className="block text-gray-700 mb-1">Item Name*</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 mb-1">Category*</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                      <option value="">-- Select --</option>
                  <option value="toy">Toy</option>
                  <option value="book">Book</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 mb-1">Description*</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Condition */}
                          <div>
              <label className="block text-gray-700 mb-1">Condition*</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select --</option>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="used">Well-used</option>
              </select>
            </div>

              {/* NGO Selection */}
              <div>
                <label className="block text-gray-700 mb-1">Select Organization*</label>
                <select
                  value={formData.ngo}
                  onChange={(e) => setFormData({...formData, ngo: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Select --</option>
                  {NGOs.map((ngo, index) => (
                    <option key={index} value={ngo}>{ngo}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donor Name */}
              <div>
                <label className="block text-gray-700 mb-1">Your Name*</label>
                <input
                  type="text"
                  value={formData.donorName}
                  onChange={(e) => setFormData({...formData, donorName: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Donor Email */}
              <div>
                <label className="block text-gray-700 mb-1">Your Email*</label>
                <input
                  type="email"
                  value={formData.donorEmail}
                  onChange={(e) => setFormData({...formData, donorEmail: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded text-white font-medium transition"
                style={{
                  backgroundColor: "#278d82",
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer"
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Donation'}
              </button>
            </div>
          </form>
        </div>

        {/* Partner Organizations */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-blue-700"
          style={{ color: "#278d82" }}
          >
          Our Partner Organizations
          </h2>
          <div className="grid mb-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {NGOs.map((ngo, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <h3 className="font-medium">{ngo}</h3>
                <p className="text-sm  text-gray-500 mt-1">Accepts: Toys, Books</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default CharityPage;