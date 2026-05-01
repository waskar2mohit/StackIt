import React from 'react';

const Loader = () => (
  <div className="flex flex-col items-center justify-center py-20 opacity-40">
    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="font-bold text-gray-400">Loading Discussions...</p>
  </div>
);

export default Loader;