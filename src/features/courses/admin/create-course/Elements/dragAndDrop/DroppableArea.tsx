import { useDroppable } from "@dnd-kit/core";

interface DroppableAreaProps {
  droppedChoice: string | null;
  droppedIndex: number;
}

function DroppableArea({
  droppedChoice,
  droppedIndex,
  id,
}: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { droppedChoice },
  });

  const style = {
    opacity: isOver ? 1 : 0.5,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-dashed border-2 border-gray-300 min-w-[100px] min-h-[100px] flex justify-center items-center mt-4"
    >
      {droppedChoice && <span>{droppedChoice}</span>}
    </div>
  );
}

export default DroppableArea;
