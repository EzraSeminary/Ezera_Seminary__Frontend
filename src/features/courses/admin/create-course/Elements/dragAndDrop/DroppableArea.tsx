import { useDroppable } from "@dnd-kit/core";

interface DroppableAreaProps {
  droppedChoice: string[];
  droppedIndex: number;
}

function DroppableArea({ droppedChoice, droppedIndex }: DroppableAreaProps) {
  const { setNodeRef } = useDroppable({
    id: `droppable-${droppedIndex}`,
    data: { droppedChoice },
  });

  return (
    <div
      ref={setNodeRef}
      className="border-dashed border-2 border-gray-300 min-w-[50px] min-h-[50px] flex justify-center items-center mt-4"
    >
      {droppedChoice}
    </div>
  );
}

export default DroppableArea;
