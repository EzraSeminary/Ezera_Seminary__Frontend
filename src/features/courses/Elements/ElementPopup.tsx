import { elementData, ElementData } from "./ElementData";
import { XCircle } from "@phosphor-icons/react";

interface ElementPopupProps {
  closeElementPopup: () => void;
  onSelectElement: (elementType: string) => void;
}

function ElementPopup({
  closeElementPopup,
  onSelectElement,
}: ElementPopupProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative flex flex-col items-center justify-center bg-secondary-2 w-[90%] h-[90%] rounded-xl">
        <XCircle
          size={32}
          onClick={closeElementPopup}
          className="cursor-pointer absolute top-1 right-1"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {elementData.map((element: ElementData, index: number) => (
            <div
              key={index}
              onClick={() => {
                console.log("Element clicked:", element.value);
                onSelectElement(element.value);
                closeElementPopup();
              }}
              className="bg-white rounded-lg shadow-md p-4 hover:scale-105 transition-transform duration-300 ease-in-out hover:cursor-pointer"
            >
              <h2 className="text-xl font-nokia-bold">{element.title}</h2>
              <p className="text-secondary-7">{element.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ElementPopup;
