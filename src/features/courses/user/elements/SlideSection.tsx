import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

interface SlideSectionProps {
  slideItems: string[];
  setIsSlideComplete?: (isComplete: boolean) => void;
}

const SlideSection: React.FC<SlideSectionProps> = ({ slideItems, setIsSlideComplete }) => {
  const listItemsComponent = slideItems.map((listItem, index) => (
    <SplideSlide
      key={index}
      className="flex justify-center items-center mx-auto text-primary-5 font-nokia-bold w-[100%] h-auto text-justify px-14 md:px-16 py-6 tracking-wide text-xs lg:text-lg xl:text-xl "
    >
      {listItem}
    </SplideSlide>
  ));

  return (
    <div className="rounded-lg shadow-2xl my-2 bg-secondary-6 bg-opacity-20 w-full lg:py-6 overflow-y-auto scrollbar-thin ">
      <div className="w-full mx-auto h-auto px-2">
        <Splide
          options={{
            perPage: 1,
            type: "fade",
            height: "auto",
            width: "100%",
            cursor: "pointer",
            autoWidth: false,
            arrows: true,
            pagination: true,
            focus: "center",
            trimSpace: true,
            isNavigation: false,
            gap: "1rem",
          }}
          onMoved={(_, newIndex) => {
            if (newIndex === slideItems.length - 1) {
              if (setIsSlideComplete)
                setIsSlideComplete(true);
            }
          }}
        >
          {listItemsComponent}
        </Splide>
      </div>
    </div>
  );
};

export default SlideSection;