import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
  import 'react-carousel-component/dist/style.css';

interface SequenceSectionProps {
  sequenceItems: string[];
  isSequenceCompleted: boolean;
  setIsSequenceCompleted: (visible: boolean) => void;
}

const SequenceSection: React.FC<SequenceSectionProps> = ({
  sequenceItems,
  setIsSequenceCompleted,
}) => {
  return (
    <div className="h-[65%] md:h-[30%] lg:h-[50%] w-full flex justify-center items-center">
      <Carousel
        orientation="vertical"
        opts={{
          align: "center",
        }}
        onLastItemVisible={(visible) => setIsSequenceCompleted(visible)}
        className="w-full flex justify-center items-center h-auto"
      >
        <CarouselContent className="h-[200px] md:h-[150px]">
          {sequenceItems.map((sequenceItem, index) => (
            <CarouselItem key={index}>
              <div className="flex items-center justify-center p-6 bg-secondary-4 bg-opacity-25 w-full rounded-xl shadow-2xl h-full">
                <span className="text-accent-5 text-lg lg:text-xl text-justify font-nokia-bold">
                  {sequenceItem}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default SequenceSection;