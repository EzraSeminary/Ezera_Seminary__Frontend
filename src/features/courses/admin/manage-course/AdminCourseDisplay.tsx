import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectChapters,
  selectSlides,
  Chapter,
  Slide,
  CourseState,
  CustomElement,
  QuizElement,
  DndElement,
  MixElement,
} from "@/redux/courseSlice";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";
import { XCircle, CheckFat, YoutubeLogo } from "@phosphor-icons/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ReactCardFlip from "react-card-flip";
import Slider from "@mui/material/Slider";
import { sliderMarks } from "@/utils/SliderMarks";
import {
  DndContext,
  PointerSensor,
  useSensors,
  useSensor,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import DraggableItem from "../../Elements/dragAndDrop/DraggableItem";
import DroppableArea from "../../Elements/dragAndDrop/DroppableArea";
import AccordionItemDisplay from "../../Elements/AccordionItemDisplay";

interface FlipState {
  [index: number]: boolean;
}

interface SelectedSlideIndex {
  chapter: number;
  slide: number;
}

interface AdminCourseDisplayProps {
  selectedSlideIndex: SelectedSlideIndex;
  onNextSlide: () => void;
}

function AdminCourseDisplay({
  selectedSlideIndex,
  onNextSlide,
}: AdminCourseDisplayProps) {
  // Flip state
  const [flip, setFlip] = useState<FlipState>({});
  // Slider state
  const [sliderValue, setSliderValue] = useState(2.5);

  //track whether the selected answer is correct or not.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isDndAnswerCorrect, setIsDndAnswerCorrect] = useState<boolean | null>(
    null
  );

  //show quiz result
  const [showQuizResult, setShowQuizResult] = useState(false);

  //Quiz Related functions
  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const handleRadioChange = (choiceIndex: number, choiceValue: string) => {
    setSelectedChoice(choiceIndex);
    //logic to determine whether the selected answer is correct.
    if (selectedSlide.elements.some((el) => el.type === "quiz")) {
      const quizElement = selectedSlide.elements.find(
        (el): el is QuizElement => el.type === "quiz"
      );
      if (quizElement) {
        const isCorrect = choiceValue === quizElement.value.correctAnswer;
        setIsAnswerCorrect(isCorrect);
        setShowQuizResult(false); // Reset showResult when a new answer is selected
      }
    }
  };

  // For "dnd" type
  const handleCheckAnswer = () => {
    if (selectedSlide?.elements?.some((element) => element.type === "dnd")) {
      // Get the "dnd" element
      const dndElement = selectedSlide.elements.find(
        (element): element is DndElement => element.type === "dnd"
      );
      if (dndElement && droppedChoice) {
        // Assume that correctDndAnswer is the property that holds the correct answer for dndElement.
        const isDndCorrect =
          droppedChoice === dndElement.value.correctDndAnswer;
        setIsDndAnswerCorrect(isDndCorrect);
      }
    }

    setShowQuizResult(true);
  };

  //isCorrect switch
  // Render quiz result
  const renderQuizResult = () => {
    if (!showQuizResult || isAnswerCorrect === null) return null; // Don't show feedback before a choice has been made

    if (isAnswerCorrect) {
      return (
        <CheckFat size={40} weight="fill" className="text-green-700 pl-1" />
      );
    } else {
      return <XCircle size={40} weight="fill" className="text-red-700 pl-1" />;
    }
  };

  // Render dnd result
  const renderDndResult = () => {
    if (isDndAnswerCorrect === true) {
      return (
        <CheckFat size={40} weight="fill" className="text-green-700 pl-1" />
      );
    } else if (isDndAnswerCorrect === false) {
      return <XCircle size={40} weight="fill" className="text-red-700 pl-1" />;
    }

    return null;
  };

  const chapters = useSelector(selectChapters) as Chapter[];
  const slides = useSelector((state: { course: CourseState }) =>
    selectSlides(state, selectedSlideIndex.chapter)
  ) as Slide[];
  const selectedChapter = chapters[selectedSlideIndex.chapter];
  const selectedSlide = slides[selectedSlideIndex.slide];

  //slide number
  const currentSlideNumber = selectedSlideIndex.slide + 1;
  const totalSlides = slides.length;
  const isLastSlide = selectedSlideIndex.slide === totalSlides - 1;

  //Display image from state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [mixImagePreviewUrl, setMixImagePreviewUrl] = useState("");
  const [audioPlayUrl, setAudioPlayUrl] = useState<string>("");

  useEffect(() => {
    if (selectedSlide && selectedSlide?.elements) {
      // If it's an img type element
      const imgElement = selectedSlide.elements.find((e) => e.type === "img");
      if (imgElement && imgElement.value instanceof File) {
        const objectUrl = URL.createObjectURL(imgElement.value as File);
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
    setShowQuizResult(false); // Reset the showQuizResult state
  }, [selectedSlide]);

  // Flip divs on Reveal Element
  const handleFlip = (index: number) => {
    setFlip((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the state
    }));
  };

  // Save the state of the slider
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setSliderValue(newValue);
    }
  };

  // Drag and Drop Functions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  // dropped choice
  const [droppedChoice, setDroppedChoice] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedItem(active.id as string);
    console.log(draggedItem);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id === "droppable" && active.data?.current?.choice) {
      const choiceToAdd = active.data.current.choice.text;
      if (typeof choiceToAdd === "string") {
        setDroppedChoice(choiceToAdd);
      }
    } else {
      setDroppedChoice(null); // Reset or handle this scenario if needed.
    }

    setDraggedItem(null);
  };

  // Define sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get video id from youtube link
  const getYoutubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get the youtube image
  const getYoutubeThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  };

  return (
    <div className="h-screen chapter-img-1 bg-no-repeat bg-cover bg-center rounded-b-lg">
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
                    <p
                      key={element.type}
                      className="text-primary-6 font-nokia-bold self-center tracking-wide text-justify text-xs"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "img") {
                  const altText =
                    element.value instanceof File
                      ? element.value.name
                      : "no image";

                  // display new image from redux or previous image from server
                  const srcValue =
                    imagePreviewUrl ||
                    `https://ezra-seminary.me/images/` + element.value;

                  elementComponent = (
                    <img
                      key={element.type}
                      src={srcValue}
                      alt={altText}
                      className="w-[40%] mx-auto"
                    />
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
                    <div
                      key={uniqueKey}
                      className="flex flex-col justify-center items-center mb-4"
                    >
                      {/* Questions */}
                      <p className="text-primary-6 font-nokia-bold text-lg">
                        {element.value.question}
                      </p>
                      {/* Choices */}
                      {element.value.choices && (
                        <div className="flex flex-col mt-2">
                          {element.value.choices.map((choice, choiceIndex) => {
                            return (
                              <label
                                key={`${uniqueKey}-choice-${choiceIndex}`}
                                className="inline-flex items-center"
                              >
                                <input
                                  type="radio"
                                  className="w-5 h-5 appearance-none bg-primary-6 focus:bg-orange-400 rounded-full transition-all"
                                  checked={selectedChoice === choiceIndex}
                                  onChange={() =>
                                    handleRadioChange(choiceIndex, choice.text)
                                  }
                                />
                                <span className="text-primary-6 font-nokia-bold text-sm ml-2">
                                  {choice.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      {/* Correct Answer */}
                      <div className="flex mt-2">
                        <button
                          className="text-primary-6 text-center font-nokia-bold bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-sm lg:py-1 px-2"
                          onClick={() => setShowQuizResult(true)}
                        >
                          Check Answer
                        </button>
                        {renderQuizResult()}
                      </div>
                    </div>
                  );
                } else if (element.type === "slide") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <SplideSlide
                        key={index}
                        className="text-primary-6 font-nokia-bold text-xs"
                      >
                        {listItem}
                      </SplideSlide>
                    )
                  );

                  return (
                    <div key={element._id} className="">
                      <Splide
                        className=""
                        // options={{
                        //   width: "100%",
                        //   autoWidth: false,
                        //   arrows: false,
                        //   pagination: true,
                        //   trimSpace: true,
                        //   isNavigation: true,
                        // }}
                      >
                        {listItemsComponent}
                      </Splide>
                    </div>
                  );
                } else if (element.type === "accordion") {
                  const accordionItemsComponent = element.value.map(
                    (accordionItem, index) => (
                      <AccordionItemDisplay
                        key={`${uniqueKey}-accordion-${index}`}
                        title={accordionItem.title}
                        content={accordionItem.content}
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
                    <Carousel
                      orientation="vertical"
                      opts={{
                        align: "start",
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-mt-1 h-[200px]">
                        {element.value.map((sequenceItem, index) => (
                          <CarouselItem
                            key={`${uniqueKey}-list-${index}`}
                            className="pt-1 md:basis-1/2"
                          >
                            <div className="p-1">
                              <div className="flex items-center justify-center p-6 bg-white border-2 border-secondary-3 rounded-xl shadow-2xl">
                                <span className="text-secondary-9 text-xl font-nokia-bold">
                                  {sequenceItem}
                                </span>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  );
                } else if (element.type === "reveal") {
                  elementComponent = (
                    <>
                      {element.value.map((revealItem, index) => (
                        <ReactCardFlip
                          isFlipped={flip[index] || false}
                          flipDirection="vertical"
                          key={`${uniqueKey}-reveal-${index}`}
                        >
                          <div
                            onClick={() => handleFlip(index)}
                            className="w-[350px] h-[100px] flex items-center justify-center text-center bg-white border-2 border-secondary-3 shadow-2xl my-1 px-2 text-secondary-9 text-xl hover:bg-secondary-1"
                          >
                            {revealItem.title}
                          </div>
                          <div
                            onClick={() => handleFlip(index)}
                            className="w-[350px] h-[100px] flex items-center justify-center text-center bg-white border-2 border-secondary-3 shadow-2xl my-1 px-2 text-secondary-9 text-lg hover:bg-secondary-1"
                          >
                            {revealItem.content}
                          </div>
                        </ReactCardFlip>
                      ))}
                    </>
                  );
                } else if (element.type === "range") {
                  elementComponent = (
                    <div className="w-[80%] mt-10">
                      <Slider
                        min={0}
                        max={5}
                        step={1}
                        marks={sliderMarks}
                        valueLabelDisplay="on"
                        valueLabelFormat={(value) =>
                          value === 2.5 ? "Touch to slide" : value
                        }
                        value={sliderValue}
                        onChange={handleSliderChange}
                        sx={{
                          color: "#424242",
                          "& .MuiSlider-track": {
                            backgroundColor: "#424242",
                          },
                          "& .MuiSlider-thumb": {
                            backgroundColor: "white",
                          },
                          "& .MuiSlider-mark": {
                            backgroundColor: "white",
                          },
                          "& .MuiSlider-markLabel": {
                            color: "white",
                          },
                        }}
                      />
                      <div className="flex justify-between">
                        <button className="text-white text-sm bg-secondary-7 bg-opacity-40 p-1 rounded-lg">
                          ምንም አልተማርኩም
                        </button>
                        <button className="text-white text-sm bg-secondary-7 bg-opacity-40 p-1 rounded-lg">
                          በጣም ተምሬያለሁ
                        </button>
                      </div>
                    </div>
                  );
                } else if (element.type === "dnd") {
                  elementComponent = (
                    <div
                      key={uniqueKey}
                      className="flex flex-col justify-center items-center mb-4"
                    >
                      {/* Questions */}
                      <p className="text-primary-6 font-nokia-bold text-lg">
                        {element.value.question}
                      </p>
                      {/* Choices */}
                      {element.value.choices && (
                        <DndContext
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          sensors={sensors}
                          collisionDetection={closestCenter}
                        >
                          <div className="flex my-2">
                            {element.value.choices.map(
                              (choice, choiceIndex) => {
                                if (droppedChoice !== choice.text) {
                                  return (
                                    // dragable item
                                    <DraggableItem
                                      key={choiceIndex}
                                      choice={choice}
                                      choiceIndex={choiceIndex}
                                      id="draggable"
                                    />
                                  );
                                }
                              }
                            )}
                          </div>
                          {/* dropable area */}
                          <DroppableArea
                            key={uniqueKey}
                            droppedChoice={droppedChoice}
                            id="droppable"
                          />
                        </DndContext>
                      )}
                      {/* Correct Answer */}
                      <div className="flex mt-2">
                        <button
                          className="text-primary-6 text-center font-nokia-bold bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-sm lg:py-1 px-2"
                          onClick={handleCheckAnswer}
                        >
                          Check Answer
                        </button>
                        {renderDndResult()}
                      </div>
                    </div>
                  );
                } else if (element.type === "mix") {
                  const imageSrc =
                    element.value.file instanceof File
                      ? mixImagePreviewUrl
                      : element.value.file;
                  elementComponent = (
                    <div key={index}>
                      <p className="text-primary-6 font-nokia-bold self-center tracking-wide text-justify text-xs mt-2">
                        {element.value.text1}
                      </p>
                      <img src={imageSrc} alt="" className="w-[40%] mx-auto" />
                      <p className="text-primary-6 font-nokia-bold self-center tracking-wide text-justify text-xs mt-2">
                        {element.value.text2}
                      </p>
                    </div>
                  );
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
                  const videoId = getYoutubeVideoId(element.value);
                  const thumbnailUrl = videoId
                    ? getYoutubeThumbnailUrl(videoId)
                    : undefined;

                  elementComponent = element.value && (
                    <a
                      href={element.value}
                      key={index}
                      className="relative inline-block"
                    >
                      {videoId ? (
                        <div className="relative w-[80%] mx-auto rounded-xl border-2 hover:border-accent-5 transition-all">
                          <img
                            src={thumbnailUrl}
                            alt="YouTube Thumbnail"
                            className="rounded-xl"
                          />
                          <YoutubeLogo
                            size={48}
                            color="#FF0000"
                            className="absolute inset-0 m-auto text-red-600"
                          />
                        </div>
                      ) : (
                        <p className="text-white">Invalid YouTube URL</p>
                      )}
                    </a>
                  );
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

export default AdminCourseDisplay;
