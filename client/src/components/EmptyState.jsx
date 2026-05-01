import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = () => (
  <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="text-gray-300" size={32} />
    </div>
    <h2 className="text-xl font-bold text-gray-400">No matching questions found</h2>
    <p className="text-gray-400 mt-2">Try adjusting your search terms or ask a new question.</p>
  </div>
);

export default EmptyState;