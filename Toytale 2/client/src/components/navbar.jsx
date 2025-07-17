import { useLocation, useNavigate } from "react-router-dom";
import homeIcon from "../assets/icons/home.png";
import humanitarianIcon from "../assets/icons/humanitarian.png";
import userIcon from "../assets/icons/user.png";
import commentIcon from "../assets/icons/comment.png";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/home", icon: homeIcon },
 
    { label: "Messages", href: "/messages", icon: commentIcon },
       { label: "Profile", href: "/profile", icon: userIcon },
    { label: "Charity", href: "/Charity", icon: humanitarianIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl">
      <div className="flex justify-around items-center h-16 px-4 relative">
        {/* First two nav items */}
        {navItems.slice(0, 2).map(({ label, href, icon }) => {
          const isActive = location.pathname === href;
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={`flex flex-col items-center justify-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "text-[#278d80] transform scale-105" 
                  : "text-gray-500 hover:text-[#278d80] hover:bg-gray-50"
              }`}
            >
              <img 
                src={icon} 
                alt={`${label} icon`} 
                width={22} 
                height={22} 
                className={`mb-1 transition-all duration-300`}
              />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}

        {/* Add Item Button (Center) */}
        <button
          onClick={() => navigate("/AddItem")}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#278d80] to-[#1e6b61] text-white rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-[0_8px_25px_rgba(39,141,128,0.4)] -mt-2"
        >
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transform transition-transform duration-300 hover:rotate-90"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        {/* Last two nav items */}
        {navItems.slice(2, 4).map(({ label, href, icon }) => {
          const isActive = location.pathname === href;
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={`flex flex-col items-center justify-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "text-[#278d80] transform scale-105" 
                  : "text-gray-500 hover:text-[#278d80] hover:bg-gray-50"
              }`}
            >
              <img 
                src={icon} 
                alt={`${label} icon`} 
                width={22} 
                height={22} 
                className={`mb-1 transition-all duration-300`}
              />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}