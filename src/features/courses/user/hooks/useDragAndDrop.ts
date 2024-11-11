import { useState } from 'react';
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [droppedChoice, setDroppedChoice] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedItem(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id === "droppable" && active.data?.current?.choice) {
      const choiceToAdd = active.data.current.choice.text;
      if (typeof choiceToAdd === "string") {
        setDroppedChoice(choiceToAdd);
      }
    } else {
      setDroppedChoice(null);
    }

    setDraggedItem(null);
  };

  return [draggedItem, droppedChoice, handleDragStart, handleDragEnd] as const;
};

export default useDragAndDrop;