// components/Header.jsx
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-widest">
          CACTI
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-gray-500">
            Home
          </Link>
          <Link to="/shop" className="hover:text-gray-500">
            Shop
          </Link>
        </nav>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-4">
          <FiSearch className="cursor-pointer text-xl" />
          <Link to="/signup">
          <FiUser className="cursor-pointer text-xl" />
            </Link>
          <div className="relative cursor-pointer">
            <FiShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="hover:text-gray-500"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="hover:text-gray-500"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            <div className="flex gap-4 mt-4">
              <FiSearch className="text-xl" />
              <FiUser className="text-xl" />
              <FiShoppingCart className="text-xl" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
