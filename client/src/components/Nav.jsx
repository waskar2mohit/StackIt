import React from 'react';
import { MessageSquare, Search, PlusCircle, User } from 'lucide-react';

const Nav = ({ searchQuery, setSearchQuery, setView, handleAskQuestion, user, onLogout, openAuth }) => (
  <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

      {/* Logo */}
      <div
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => setView('home')}
      >
        <div className="bg-orange-500 p-1.5 rounded-xl text-white group-hover:scale-110 transition-transform">
          <MessageSquare size={20} fill="currentColor" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-gray-900">StackIt</span>
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md relative group">
        <Search
          className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-orange-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search for questions..."
          className="w-full pl-11 pr-4 py-2.5 bg-gray-100 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all border border-transparent focus:border-orange-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAskQuestion}
          className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-orange-600 transition-all"
        >
          <PlusCircle size={18} />
          <span className="hidden sm:inline">Ask Question</span>
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-bold text-gray-900 leading-none">{user.username}</span>
              <button
                onClick={onLogout}
                className="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase mt-1"
              >
                Logout
              </button>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <button
            onClick={openAuth}
            className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center border hover:bg-gray-100"
          >
            <User size={20} />
          </button>
        )}
      </div>
    </div>
  </nav>
);

export default Nav;