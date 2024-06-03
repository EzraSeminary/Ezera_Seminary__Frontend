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
      <div className="flex flex-col items-center justify-center bg-secondary-2 w-[90%] h-[90%] rounded-2xl">
        <div className="flex justify-between items-center w-full h-[10%] px-5 bg-white border border-secondary-3 rounded-t-2xl">
          <h2 className="text-2xl">Slide Library</h2>
          <XCircle
            size={32}
            onClick={closeElementPopup}
            className="cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 w-[60%] h-[90%] overflow-auto">
          {elementData.map((element: ElementData, index: number) => (
            <div
              key={index}
              onClick={() => {
                console.log("Element clicked:", element.value);
                onSelectElement(element.value);
                closeElementPopup();
              }}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:scale-105 transition-transform duration-300 ease-in-out hover:cursor-pointer border-2 hover:border-accent-6"
            >
              <h2 className="text-xl font-nokia-bold">{element.title}</h2>
              <p className="text-secondary-4">{element.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ElementPopup;
