import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface DroppableAreaProps {
  droppedItems: string[];
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ droppedItems }) => {
  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  return (
    <div
      ref={setNodeRef}
      id="droppable"
      className="border-dashed border-2 border-gray-300 min-w-[50px] min-h-[50px] flex justify-center items-center mt-4"
    >
      {droppedItems.map((choice, index) => (
        <div key={index} className="bg-white p-2 my-1">
          {choice}
        </div>
      ))}
    </div>
  );
};

export default DroppableArea;
