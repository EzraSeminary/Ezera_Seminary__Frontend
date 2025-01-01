import React, { useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensors,
  useSensor,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import DraggableItem from "../../Elements/dragAndDrop/DraggableItem";
import DroppableArea from "../../Elements/dragAndDrop/DroppableArea";
import { DndElement } from "../../../../services/api";
import {
    XCircle,
    CheckFat,
  } from "@phosphor-icons/react";

  interface DndComponentProps {
    element: DndElement;
    droppedChoice: string | null;
    setDroppedChoice: (choice: string | null) => void;
    isDndAnswerCorrect: boolean | null;
    setIsDndAnswerCorrect: (correct: boolean | null) => void;
    setIsDndCompleted?: React.Dispatch<React.SetStateAction<boolean>>;
  }  

const DndComponent: React.FC<DndComponentProps> = ({
  element,
  droppedChoice,
  setDroppedChoice,
  isDndAnswerCorrect,
  setIsDndAnswerCorrect,
  setIsDndCompleted,
}) => {
  // Define Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // Reset the droppable area when the component mounts
    setDroppedChoice(null);
    setIsDndAnswerCorrect(null);
  }, [setDroppedChoice]);

  const handleDragStart = () => {
    setDroppedChoice(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
  
    // Check if the drag ended over a valid droppable area
    if (over && over.id === "droppable") {
      // Use active.id to find the corresponding choice text
      const droppedItem = typeof active.id === 'string' ? active.id.slice(0, -2) : '';
      if (droppedItem) {
        // Set the dropped choice to the text of the dropped item
        setDroppedChoice(droppedItem as string);
      } else {
        setDroppedChoice(null);
      }
    } else {
      setDroppedChoice(null);
    }
  };
  
  

  const handleCheckAnswer = () => {
    if (droppedChoice) {
      const isDndCorrect = droppedChoice === element.value.correctDndAnswer;
      setIsDndAnswerCorrect(isDndCorrect);
      if (setIsDndCompleted)
        setIsDndCompleted(true);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center w-[90%] mx-auto"
    >
      {/* Questions */}
      <p className="text-primary-5 text-justify font-nokia-bold text-sm lg:text-lg xl:text-xl ">
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
          <div className="flex w-[80%] flex-wrap justify-center items-center gap-3 mx-auto pt-4">
            {element.value.choices.map((choice, choiceIndex) => (
              // dragable item
              <div
                key={choiceIndex}
                className={`text-sm bg-secondary-6 bg-opacity-20 ${
                  droppedChoice === choice.text ? "opacity-50" : ""
                }`}
              >
                <DraggableItem
                  choice={choice}
                  choiceIndex={choiceIndex}
                  id={choice.text}
                />
              </div>
            ))}
          </div>
          {/* dropable area */}
          <div className="flex justify-center items-center w-[80%] h-[100px] mx-auto">
            <DroppableArea
              key={`droppable_${element._id}`}
              droppedChoice={droppedChoice}
              id="droppable"
            />
          </div>
        </DndContext>
      )}
      {/* Correct Answer */}
      <div className="flex mt-2">
        <button
          className="text-primary-6 text-center font-nokia-bold bg-accent-6 hover:bg-accent-7 w-max rounded-3xl mx-auto text-xs lg:text-lg xl:text-xl lg:py-1 px-2"
          onClick={handleCheckAnswer}
        >
          መልሱን ይመልከቱ
        </button>
        {isDndAnswerCorrect !== null && (
          <div className="pl-1">
            {isDndAnswerCorrect ? (
              <CheckFat size={40} weight="fill" className="text-green-700" />
            ) : (
              <XCircle size={40} weight="fill" className="text-red-700" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DndComponent;