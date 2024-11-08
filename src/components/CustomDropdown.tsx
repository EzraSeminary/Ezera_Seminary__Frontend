import { useState, useEffect, useRef, ChangeEvent } from "react";

interface CustomDropdownProps {
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  className?: string;
}

function CustomDropdown({
  options,
  selectedValue,
  onSelect,
  className,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className={`${className} cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue || "Select an option"}
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-4 h-4 text-accent-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-primary-6 border border-accent-6 rounded-md shadow-lg mt-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 text-accent-6 leading-tight border-b border-accent-6 bg-primary-6 rounded-t-md focus:outline-none"
            placeholder="Search..."
          />
          <ul className="max-h-56 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-secondary-2 hover:text-accent-6 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;