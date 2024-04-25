import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function DraggableItem({ choice, choiceIndex }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${choiceIndex}`,
    data: { choice },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    userSelect: "none", // Prevent text selection
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-2 my-1 cursor-move" // Added 'cursor-move' for a visual cue
      onMouseDown={(e) => e.preventDefault()} // Prevent text selection on mousedown
    >
      <span className="text-secondary-6 font-nokia-bold text-sm ml-2">
        {choice.text}
      </span>
    </div>
  );
}

export default DraggableItem;
