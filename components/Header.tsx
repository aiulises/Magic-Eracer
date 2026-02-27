
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-black/80 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-6 py-5 flex justify-center items-center">
        <div className="flex items-center cursor-pointer">
           <span className="text-xl font-medium tracking-widest text-white uppercase">AIQ<span className="text-gray-500">Labs</span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
