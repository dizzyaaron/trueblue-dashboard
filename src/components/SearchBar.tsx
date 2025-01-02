import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`flex items-center gap-2 transition-all duration-300 ${
        isExpanded ? 'w-96' : 'w-24'
      }`}>
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={isExpanded ? "Search jobs, customers, or invoices..." : "Search..."}
          className={`transition-all duration-300 bg-transparent focus:outline-none ${
            isExpanded ? 'w-full' : 'w-16'
          }`}
        />
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
        isExpanded ? 'scale-x-100' : 'scale-x-0'
      }`} />
    </div>
  );
}