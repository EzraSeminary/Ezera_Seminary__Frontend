import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableItemProps {
  choice: {
    text: string;
  };
  id: string;
}

function DraggableItem({ choice, id }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { choice },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    userSelect: "none", // Prevent text selection
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-2 my-1 cursor-move"
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className="text-secondary-6 font-nokia-bold text-sm">
        {choice.text}
      </span>
    </div>
  );
}

export default DraggableItem;
