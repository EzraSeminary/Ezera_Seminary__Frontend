import { elementData, ElementData } from "./ElementData";

function ElementPopup() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {elementData.map((element: ElementData, index: number) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-nokia-bold">{element.title}</h2>
          <p className="text-secondary-7">{element.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ElementPopup;
