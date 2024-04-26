import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableItemProps {
  choice: {
    text: string;
  };
  choiceIndex: number;
  id: string;
}

function DraggableItem({ choice, id, choiceIndex }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${id}-${choiceIndex}`,
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
      className="bg-white hover:bg-secondary-2 transition-all px-2 mx-1 cursor-move rounded-sm shadow-2xl"
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className="text-secondary-6 font-nokia-bold text-sm">
        {choice.text}
      </span>
    </div>
  );
}

export default DraggableItem;
