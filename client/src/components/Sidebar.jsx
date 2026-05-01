import React from 'react';
import { MessageSquare, User } from 'lucide-react';

const Sidebar = ({ view, setView }) => (
  <aside className="hidden lg:block lg:col-span-1">
    <div className="sticky top-28 space-y-2">
      <div
        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
          view === 'home'
            ? 'bg-orange-50 text-orange-600 font-bold'
            : 'text-gray-500 hover:bg-gray-100'
        }`}
        onClick={() => setView('home')}
      >
        <span className="flex items-center gap-3">
          <MessageSquare size={18} /> Questions
        </span>
        {view === 'home' && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
      </div>

      <div className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer transition-all">
        <User size={18} /> Users
      </div>
    </div>
  </aside>
);

export default Sidebar;