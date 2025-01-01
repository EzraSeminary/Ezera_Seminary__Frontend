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
      className={`border-2 border-gray-300 bg-accent-9 bg-opacity-70 shadow-2xl min-w-[40%] min-h-[40%] flex justify-center items-center mb-2 mt-10 ${
        isOver ? "border-solid" : "border-dashed"
      }`}
      onMouseDown={(e) => e.preventDefault()} // Prevent text selection
    >
      {droppedChoice ? (
        <div className="bg-white hover:bg-secondary-2 transition-all px-2 rounded-sm shadow-2xl cursor-move">
          <span className="text-secondary-6 font-nokia-bold text-lg">
            {droppedChoice}
          </span>
        </div>
      ) : (
        <span className="text-white font-nokia-bold text-lg">ምርጫዎን እዚህ ላይ ያስቀምጡ</span>
      )}
    </div>
  );
}

export default DroppableArea;
