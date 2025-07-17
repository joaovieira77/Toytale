// src/pages/WelcomePage.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import  {BackgroundLines } from "../components/background";
export default function WelcomePage() {
  const [bearVisible, setBearVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setBearVisible(true), 300);
  }, []);
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <BackgroundLines />
      <div className="relative z-10 flex flex-col items-center justify-center -mt-60">
        <img 
          src="/toytalelogo.png" 
          alt="Toytale Logo" 
          className="h-16 mb-6 object-contain"
        />
        
        {/* Animated Bear */}
        <img
          src="/teddiebear.png"
          alt="Animated Bear"
          className={`w-64 h-64 pointer-events-none object-contain transition-all duration-700 ease-out  -mb-1
            ${bearVisible ? "opacity-100" : "opacity-0"}
          `}
        />
        
        <Link to="/auth">
          <button 
            className="px-6 py-3 text-white rounded-lg shadow-md hover:opacity-90 transition font-semibold"
            style={{ backgroundColor: '#278d80' }}
          >
            Sign Up / Log In
          </button>
        </Link>
      </div>
    </div>
  );
}
