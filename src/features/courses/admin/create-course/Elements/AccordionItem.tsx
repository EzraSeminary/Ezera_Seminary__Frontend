import React, { useState } from "react";

interface AccordionItemProps {
  title: string;
  content: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <div
        className="flex justify-between items-center p-2 bg-gray-200 cursor-pointer"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span>{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && (
        <div className="p-2 bg-gray-100">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;