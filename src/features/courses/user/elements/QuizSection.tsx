import React, { useState } from 'react';
import { CheckFat, XCircle } from '@phosphor-icons/react';

interface QuizSectionProps {
  question: string;
  choices: { text: string }[];
  correctAnswer: string;
  selectedChoice: number | null;
  setSelectedChoice: React.Dispatch<React.SetStateAction<number | null>>;
}

const QuizSection: React.FC<QuizSectionProps> = ({
  question,
  choices,
  correctAnswer,
  selectedChoice,
  setSelectedChoice,
}) => {
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const handleRadioChange = (
    choiceIndex: number,
    choiceValue: string,
    elementCorrectAnswer: string
  ) => {
    setSelectedChoice(choiceIndex);
    setIsAnswerCorrect(choiceValue === elementCorrectAnswer);
    setShowQuizResult(false); // Reset showResult when a new answer is selected
  };

  const renderQuizResult = () => {
    if (!showQuizResult || isAnswerCorrect === null) return null; // Don't show feedback before a choice has been made

    if (isAnswerCorrect) {
      return (
        <CheckFat size={40} weight="fill" className="text-green-700 pl-1" />
      );
    } else {
      return <XCircle size={40} weight="fill" className="text-red-700 pl-1" />;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mb-4">
      {/* Questions */}
      <p className="text-secondary-2 mx-auto font-nokia-bold text-sm lg:text-lg xl:text-xl">
        {question}
      </p>
      {/* Choices */}
      {choices && (
        <div className="flex flex-col mt-2 space-y-2">
          {choices.map((choice, choiceIndex) => (
            <label
              key={`${question}-choice-${choiceIndex}`}
              className="inline-flex items-center"
            >
              <input
                type="radio"
                className={`w-5 h-5 rounded-full transition-all pt-2 cursor-pointer border-2 ${
                  selectedChoice === choiceIndex
                    ? "bg-orange-400 border-orange-400"
                    : "bg-secondary-2 border-secondary-2"
                }`}
                checked={selectedChoice === choiceIndex}
                onChange={() =>
                  handleRadioChange(choiceIndex, choice.text, correctAnswer)
                }
                disabled={isQuizAnswered}
              />
              <span className="text-accent-6 font-nokia-bold text-xs lg:text-lg xl:text-xl ml-2">
                {choice.text}
              </span>
            </label>
          ))}
        </div>
      )}
      {/* Correct Answer */}
      <div className="flex mt-4">
        <button
          className="text-white text-center font-nokia-bold bg-accent-6 hover:bg-accent-7 w-max rounded-3xl mx-auto text-xs1 lg:text-lg xl:text-xl lg:py-1 px-2"
          onClick={() => {
            setShowQuizResult(true);
            setIsQuizAnswered(true); //Next button available when the check answer button is clicked
          }}
        >
          Check Answer
        </button>
        {renderQuizResult()}
      </div>
    </div>
  );
};

export default QuizSection;