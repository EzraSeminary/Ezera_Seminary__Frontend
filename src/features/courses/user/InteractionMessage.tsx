interface InteractionMessageProps {
  interactionType: string;
}

function InteractionMessage({ interactionType }: InteractionMessageProps) {
  const interactionMessages: Record<string, string> = {
    quiz: 'Please complete the quiz before proceeding.',
    dnd: 'Complete the drag-and-drop activity to move forward.',
    video: 'Watch the video to the end to continue.',
    audio: 'Play the audio fully to proceed.',
    slide: 'View all the content on the slide to move ahead.',
    accordion: 'Expand the accordion and read the content to continue.',
  };

  const message = interactionMessages[interactionType] || 'Complete all tasks to proceed.';

  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-3 py-1 shadow-lg">
      {message}
    </div>
  );
}

export default InteractionMessage;

// Utility function to check the type of interactive element on the slide
export function getCurrentInteractionType(elements: { type: string }[]): string | null {
  const interactionOrder = ['quiz', 'dnd', 'video', 'audio', 'accordion', 'slide'];
  for (const type of interactionOrder) {
    if (elements.some(element => element.type === type)) {
      return type;
    }
  }
  return null;
}
