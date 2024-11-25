import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectChapters,
  selectSlides,
  Chapter,
  CustomElement,
  Slide,
  MixElement,
} from "../../../../redux/courseSlice";
import AccordionItemDisplay from "../../Elements/AccordionItemDisplay";
import { RootState } from "../../../../redux/store";
import { sliderMarks } from "@/utils/SliderMarks";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SliderSection from "../../user/elements/SliderSection";
import RevealSection from "../../user/elements/RevealSection";
import DndComponent from "../../user/elements/DndComponent";
import SequenceSection from "../../user/elements/SequenceSection";
import QuizSection from "../../user/elements/QuizSection";
import VideoSection from "../../user/elements/VideoSection";
import SlideSection from "../../user/elements/SlideSection";
import MixSection from "../../user/elements/MixSection";
import VerseSection from "../../user/elements/VerseSection";
import MainVerseSection from "../../user/elements/MainVerseSection";
interface SlideDataDisplayProps {
  selectedSlideIndex: {
    chapter: number;
    slide: number;
  };
  onNextSlide: () => void;
}

function SlideDataDisplay({
  selectedSlideIndex,
  onNextSlide,
}: SlideDataDisplayProps) {
  //track whether the selected answer is correct or not.
  const [isDndAnswerCorrect, setIsDndAnswerCorrect] = useState<boolean | null>(
    null
  );
  // Slider state
  const [sliderValue, setSliderValue] = useState(2.5);

  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const handleToggle = (value: string) => {
    setActiveAccordion(value === activeAccordion ? null : value);
    console.log("Toggled accordion:", value);
  };

  //Quiz Related functions
  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);


  const chapters = useSelector(selectChapters) as Chapter[];
  const slides: Slide[] = useSelector((state: RootState) =>
    selectSlides(state, selectedSlideIndex.chapter)
  );
  const selectedChapter = chapters[selectedSlideIndex.chapter];
  const selectedSlide = slides[selectedSlideIndex.slide];

  //slide number
  const currentSlideNumber = selectedSlideIndex.slide + 1;
  const totalSlides = slides.length;
  const isLastSlide = selectedSlideIndex.slide === totalSlides - 1;

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [ , setMixImagePreviewUrl] = useState("");
  const [audioPlayUrl, setAudioPlayUrl] = useState<string>("");

  useEffect(() => {
    if (selectedSlide && selectedSlide.elements) {
      // If it's an img type element
      const imgElement = selectedSlide.elements.find(
        (element) => element.type === "img"
      );
      if (imgElement && imgElement.value instanceof File) {
        const objectUrl = URL.createObjectURL(imgElement.value);
        setImagePreviewUrl(objectUrl);

        // Clean up the URL when the component unmounts
        return () => URL.revokeObjectURL(objectUrl);
      }

      // If it's a mix type element
      const mixElement = selectedSlide.elements.find(
        (element): element is MixElement => element.type === "mix"
      );
      if (mixElement && mixElement.value.file instanceof File) {
        const objectUrl = URL.createObjectURL(mixElement.value.file);
        setMixImagePreviewUrl(objectUrl); // Assuming you have a state for this

        // Clean up the URL when the component unmounts
        return () => URL.revokeObjectURL(objectUrl);
      }

      // If it's an audio type element
      const audioElement = selectedSlide.elements.find(
        (element) => element.type === "audio"
      );
      if (audioElement && audioElement.value instanceof File) {
        const objectUrl = URL.createObjectURL(audioElement.value);
        setAudioPlayUrl(objectUrl);

        // Clean up the URL when the component unmounts
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        // Reset URL if no audio element is present
        setAudioPlayUrl("");
      }
    }
  }, [selectedSlide]);

  // dropped choice
  const [droppedChoice, setDroppedChoice] = useState<string | null>(null);



  // Switch from the image to the video
  const handleImageClick = () => {
    setIsVideoVisible(true);
  };

  return (
    <div className=" h-screen chapter-img-1 bg-no-repeat bg-cover bg-center rounded-b-lg">
      <div className="flex flex-col justify-between w-full h-full">
        <div>
          <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
            <h1 className="font-nokia-bold text-primary-6 text-xs lg:text-sm">
              {selectedChapter?.chapter}
            </h1>
            <p className="font-nokia-bold text-primary-6 text-xs lg:text-sm">
              {currentSlideNumber}/{totalSlides}
            </p>
          </div>
          <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
        </div>
        {selectedSlide && selectedSlide.elements && (
          <div className="flex flex-col justify-center items-center flex-grow p-5 w-full h-full overflow-y-hidden">
            <ul className="flex flex-col justify-center items-center w-full h-full overflow-y-auto scrollbar-thin relative">
              <h1 className="text-2xl text-primary-6 text-center font-nokia-bold">
                {selectedSlide.slide}
              </h1>
              {selectedSlide.elements.map((element: CustomElement, index) => {
                let elementComponent = null;
                const uniqueKey = `${element.type}-${index}`;

                if (element.type === "title") {
                  elementComponent = (
                    <h1
                      key={element.type}
                      className="text-primary-6 text-2xl font-nokia-bold text-center"
                    >
                      {element.value}
                    </h1>
                  );
                } else if (element.type === "sub") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-primary-6 font-nokia-bold w-[100%] self-center tracking-wide text-lg text-center"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "text") {
                  elementComponent = (
                    <div className="my-3 rich-text-container rich-course">
                    <ReactQuill
                      key={element.type}
                      value={element.value || ''}
                      readOnly={true}
                      theme="snow"
                    />
                  </div>
                  );
                } else if (element.type === "list") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <li
                        key={`${uniqueKey}-list-${index}`}
                        className="text-primary-6 font-nokia-bold w-[100%] tracking-wide text-xs"
                      >
                        {listItem}
                      </li>
                    )
                  );

                  elementComponent = (
                    <div className="flex flex-col justify-center items-center ml-8">
                      <ul className="list-disc mt-2">{listItemsComponent}</ul>
                    </div>
                  );
                } else if (element.type === "quiz") {
                  elementComponent = (
                    <QuizSection
                      question={element.value.question}
                      choices={element.value.choices}
                      correctAnswer={element.value.correctAnswer}
                      selectedChoice={selectedChoice}
                      setSelectedChoice={setSelectedChoice}
                    />
                  );
                } else if (element.type === "verse") {
                  const verses: [string, string][] = [];
                  for (let i = 0; i < element.value.length; i += 2) {
                    if (element.value[i + 1]) {
                      verses.push([element.value[i], element.value[i + 1]]);
                    } else {
                      throw new Error("Invalid data structure: Missing text for reference.");
                    }
                  }

                  elementComponent = <VerseSection verses={verses} />;
                } else if (element.type === "main-verse") {
                  const verses: [string, string][] = [];
                  for (let i = 0; i < element.value.length; i += 2) {
                    if (element.value[i + 1]) {
                      verses.push([element.value[i], element.value[i + 1]]);
                    } else {
                      throw new Error("Invalid data structure: Missing text for reference.");
                    }
                  }

                  elementComponent = <MainVerseSection verses={verses} />;
                } else if (element.type === "slide") {
                 elementComponent = (
                  <SlideSection
                    slideItems={element.value}
                 />
                 )
                } else if (element.type === "img") {
                  const altText =
                    element.value instanceof File
                      ? element.value.name
                      : "image";
                  elementComponent = (
                    <img
                      key={element.type}
                      src={imagePreviewUrl}
                      alt={altText}
                      className="w-[40%] mx-auto"
                    />
                  );
                } else if (element.type === "accordion") {
                  const accordionItemsComponent = element.value.map(
                    (accordionItem, index) => (
                      <AccordionItemDisplay
                        key={`${uniqueKey}-accordion-${index}`}
                        title={accordionItem.title}
                        content={accordionItem.content}
                        onToggle={handleToggle}
                      />
                    )
                  );

                  elementComponent = (
                    <div className="flex flex-col justify-center items-center w-full">
                      {accordionItemsComponent}
                    </div>
                  );
                } else if (element.type === "sequence") {
                  elementComponent = (
                    <SequenceSection
                      sequenceItems={element.value}
                    />
                  );
                } else if (element.type === "reveal") {
                  elementComponent = (
                    <RevealSection
                      revealItems={element.value}
                    />
                  );
                } else if (element.type === "range") {
                  elementComponent = (
                    <SliderSection
                      sliderMarks={sliderMarks}
                      sliderValue={sliderValue}
                      setSliderValue={setSliderValue}
                    />
                  );
                } else if (element.type === "dnd") {
                  elementComponent = (
                    <DndComponent
                      element={element}
                      droppedChoice={droppedChoice}
                      setDroppedChoice={setDroppedChoice}
                      isDndAnswerCorrect={isDndAnswerCorrect}
                      setIsDndAnswerCorrect={setIsDndAnswerCorrect}
                  />
                  );
                } else if (element.type === "mix") {
                  elementComponent = (
                    <MixSection
                      text1={element.value.text1}
                      text2={element.value.text2}
                      file={element.value.file}
                    />
                  )
                } else if (element.type === "audio") {
                  elementComponent = audioPlayUrl && (
                    <div
                      key={uniqueKey}
                      className="flex flex-col items-center justify-center w-full p-4 bg-gray-100 rounded-lg shadow-md"
                    >
                      <audio controls className="w-full">
                        <source src={audioPlayUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  );
                } else if (element.type === "video") {
                  elementComponent = (
                    <VideoSection
                      videoUrl={element.value}
                      isVideoVisible={isVideoVisible}
                      handleImageClick={handleImageClick}
                    />
                  )
                }
                return elementComponent;
              })}
            </ul>
          </div>
        )}
        <div className="mb-4 w-[100%] flex flex-col items-center justify-center">
          <hr className="border-accent-5  border-1 w-[90%] mx-auto z-50 " />
          {!isLastSlide && (
            <button
              onClick={onNextSlide}
              className="text-primary-6 text-center font-nokia-bold mt-2 py-1 px-2 bg-accent-6 hover:bg-accent-7 w-[15%] rounded-3xl text-xs transition-all"
            >
              ቀጥል
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideDataDisplay;
