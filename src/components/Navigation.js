import React, { useState } from 'react';
import Logo from '../assets/img/B.png';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative shadow-lg bg-white font-montserrat">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-64 py-6">
        
        {/* Left: menu items (ẩn ở mobile) */}
        <div className="hidden lg:flex gap-8 items-center text-xl">
          <a href="#">Hello,</a>
          <a href="#">Menus</a>
          <a href="#" className="underline">An's Spa</a>
          <a href="#">Our Story</a>
          <a href="#">Projects</a>
        </div>

        {/* Center: logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={Logo} alt="An's Logo" className="h-12 md:h-16 lg:h-20" />
        </div>

        {/* Right: social + button (ẩn nút ở mobile) */}
        <div className="flex items-center gap-4 text-lg">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <button className="hidden md:block bg-green-900 text-white px-4 md:px-6 py-2 md:py-3 rounded text-sm">
            Dining Reservations
          </button>

          {/* Hamburger menu */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="lg:hidden px-6 pb-4 text-base space-y-2">
          <a href="#" className="block">Hello,</a>
          <a href="#" className="block">Menus</a>
          <a href="#" className="block underline">An's Spa</a>
          <a href="#" className="block">Our Story</a>
          <a href="#" className="block">Projects</a>
          <button className="w-full mt-2 bg-green-900 text-white py-2 rounded text-sm">
            Dining Reservations
          </button>
        </div>
      )}
    </header>
  );
}
