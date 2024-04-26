import { useDroppable } from "@dnd-kit/core";

interface DroppableAreaProps {
  droppedChoice: string | null;
  id: string;
}

function DroppableArea({ droppedChoice, id }: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { droppedChoice },
  });

  return (
    <div
      ref={setNodeRef}
      className={`border-dashed border-2 border-gray-300 min-w-[100px] min-h-[50px] flex justify-center items-center my-2 ${
        isOver ? "opacity-100" : "opacity-50"
      }`}
    >
      {droppedChoice && (
        <div className="bg-white hover:bg-secondary-2 transition-all px-2 rounded-sm shadow-2xl cursor-move">
          <span className="text-secondary-6 font-nokia-bold text-sm">
            {droppedChoice}
          </span>
        </div>
      )}
    </div>
  );
}

export default DroppableArea;
