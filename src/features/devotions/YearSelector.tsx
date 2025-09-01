import React from 'react';
import { getCurrentEthiopianYear } from './devotionUtils';

interface YearSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears?: number[];
  userRole?: string;
}

const YearSelector: React.FC<YearSelectorProps> = ({ 
  selectedYear, 
  onYearChange, 
  availableYears = [],
  userRole
}) => {
  const currentYear = getCurrentEthiopianYear(); // Current Ethiopian year (dynamic)
  const nextYear = currentYear + 1; // Coming Ethiopian year

  // Create list of years to display - start with available years if any exist
  const yearOptions = [];
  
  // Add "All Years" option first
  yearOptions.push({ value: 'all', label: 'ሁሉም ዓመታት' });
  
  // Add current year
  yearOptions.push({ value: currentYear.toString(), label: `${currentYear} (የአሁኑ ዓመት)` });
  
  // Add next year (for admin/instructor preparation)
  yearOptions.push({ value: nextYear.toString(), label: `${nextYear} (የሚመጣው ዓመት)` });
  
  // Add other available years from the backend
  availableYears
    .filter(year => year !== currentYear && year !== nextYear)
    .forEach(year => {
      yearOptions.push({ value: year.toString(), label: year.toString() });
    });

  // Only show for Admin and Instructor roles
  if (!userRole || (userRole !== "Admin" && userRole !== "Instructor")) {
    return null;
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-4 font-nokia-bold">
        <label className="text-sm font-medium text-accent-6 whitespace-nowrap">
          በዓመት ማየት:
        </label>
        <select
          className="border-2 border-accent-6 bg-white outline-accent-7 rounded-md px-3 py-2 text-accent-6 cursor-pointer min-w-[200px]"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
        >
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="text-xs text-gray-500 ml-4">
          {selectedYear === 'all' && 'ከሁሉም ዓመታት ጥቅሶች እየታዩ ነው'}
          {selectedYear === currentYear.toString() && 'የአሁኑ ዓመት ጥቅሶች እየታዩ ነው'}
          {selectedYear === nextYear.toString() && 'የሚመጣው ዓመት ጥቅሶች እየታዩ ነው'}
          {selectedYear !== 'all' && selectedYear !== currentYear.toString() && selectedYear !== nextYear.toString() && 
            `የ${selectedYear} ዓመት ጥቅሶች እየታዩ ነው`}
        </div>
      </div>
    </div>
  );
};

export default YearSelector;
