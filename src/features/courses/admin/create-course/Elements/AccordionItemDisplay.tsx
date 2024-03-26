import React, { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

interface AccordionItemProps {
  title: string;
  content: string;
}

const AccordionItemDisplay: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
      {content}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  );
};

export default AccordionItemDisplay;