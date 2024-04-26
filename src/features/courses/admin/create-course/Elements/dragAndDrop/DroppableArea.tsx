import { useDroppable } from "@dnd-kit/core";

interface DroppableAreaProps {
  droppedChoice: string | null;
  droppedIndex: number;
}

function DroppableArea({ droppedChoice, droppedIndex }: DroppableAreaProps) {
  const { setNodeRef } = useDroppable({
    id: "droppable",
    data: { droppedChoice },
  });

  return (
    <div
      ref={setNodeRef}
      className="border-dashed border-2 border-gray-300 min-w-[100px] min-h-[100px] flex justify-center items-center mt-4"
    >
      {droppedChoice && <span>{droppedChoice}</span>}
    </div>
  );
}

export default DroppableArea;
