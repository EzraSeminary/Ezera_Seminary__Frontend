import { useDroppable } from "@dnd-kit/core";

interface DroppableAreaProps {
  droppedChoice: string | null;
  droppedIndex: number;
  id: string;
}

function DroppableArea({ droppedChoice, id }: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { droppedChoice },
  });
  console.log("choice", droppedChoice);

  const style = {
    opacity: isOver ? 1 : 0.5,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-dashed border-2 border-gray-300 min-w-[100px] min-h-[100px] flex justify-center items-center mt-4"
    >
      {droppedChoice && (
        <div className="bg-white p-2 my-1">
          <span className="text-secondary-6 font-nokia-bold text-sm">
            {droppedChoice}
          </span>
        </div>
      )}
    </div>
  );
}

export default DroppableArea;
