import { elementData, ElementData } from "./ElementData";

interface ElementPopupProps {
  closeElementPopup: () => void;
}

function ElementPopup({ closeElementPopup }: ElementPopupProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center bg-secondary-2 w-[80%] h-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {elementData.map((element: ElementData, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-nokia-bold">{element.title}</h2>
              <p className="text-secondary-7">{element.description}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={closeElementPopup}
        className="bg-white rounded-lg shadow-md p-4"
      >
        Close
      </button>
    </div>
  );
}

export default ElementPopup;
