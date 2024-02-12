import { PlusCircle } from "@phosphor-icons/react";
import SSLForm from "./SSLForm";

const CreateSSL = () => {
  return (
    <div className="flex gap-4 w-[80%] h-screen mx-auto my-4 font-nokia-bold">
      <div className="w-[70%] border border-accent-6 rounded-lg px-4 py-4">
        <p className="text-xl text-accent-6">Create Sabbath School Lesson</p>
        <div className="flex justify-between px-4">
          <div className="flex gap-4 mt-2 text-secondary-6">
            <select className="border border-accent-6 px-2 py-1 rounded-sm">
              <option value="1">የእግዚአብሔርን ተልዕኮ...</option>
              <option value="1">የእግዚአብሔርን ተልዕኮ...</option>
              <option value="1">የእግዚአብሔርን ተልዕኮ...</option>
            </select>
            <select className="border border-accent-6 px-2 py-1 rounded-sm">
              <option value="1">Week 1</option>
              <option value="1">Week 2</option>
              <option value="1">Week 3</option>
            </select>
            <select className="border border-accent-6 px-2 py-1 rounded-sm">
              <option value="1">Sabbath</option>
              <option value="1">Day 1</option>
              <option value="1">Day 2</option>
              <option value="1">Day 3</option>
              <option value="1">Day 4</option>
              <option value="1">Day 5</option>
              <option value="1">Further Thought</option>
            </select>
          </div>
          <div className="flex gap-2 text-sm">
            <button className="flex items-center gap-1 text-primary-1 bg-accent-6 px-3 rounded-sm hover:bg-accent-7 transition-all">
              Create Week <PlusCircle />
            </button>
            <button className="flex items-center gap-1 text-primary-1 bg-accent-6 px-3 rounded-sm hover:bg-accent-7 transition-all">
              Create Day <PlusCircle />
            </button>
          </div>
        </div>
        <hr className="mt-4" />
      </div>
      <div className="w-[30%] border border-accent-6 rounded-lg">
        <SSLForm />
      </div>
    </div>
  );
};

export default CreateSSL;
