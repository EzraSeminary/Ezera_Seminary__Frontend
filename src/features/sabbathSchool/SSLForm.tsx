import { PlusCircle } from "@phosphor-icons/react";
import { useState } from "react";

const SSLForm = () => {
  const [date, setDate] = useState("");
  const [amhDate, setAmhDate] = useState("");
  return (
    <div className="flex flex-col p-4 text-accent-6">
      <form className="flex flex-col">
        <input
          type="date"
          className="border border-accent-6 p-2 rounded-sm w-[50%]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="mt-2 flex flex-col">
          <label>Date</label>
          <input
            type="text"
            className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 w-[75%] mt-1"
            placeholder="ሰንበት ከሰዓት፣ ጥቅምት 10"
            required
            value={amhDate}
            onChange={(e) => setAmhDate(e.target.value)}
          />
        </div>
        <div className="mt-2 flex flex-col">
          <label>Date Type</label>
          <select className="border border-accent-6 px-2 py-1 rounded-sm w-[75%] mt-1">
            <option value="1">Sabbath</option>
            <option value="1">Week Days</option>
            <option value="1">Further Thought</option>
          </select>
        </div>
        <div className="mt-2 flex flex-col">
          <label>Title</label>
          <input
            type="text"
            className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 w-[75%] mt-1"
            placeholder="ሰንበት ከሰዓት፣ ጥቅምት 10"
            required
            value={amhDate}
            onChange={(e) => setAmhDate(e.target.value)}
          />
        </div>
        <div className="mt-2 flex flex-col">
          <label>Verses to be read</label>
          <input
            type="text"
            className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 w-[75%] mt-1"
            placeholder="ሰንበት ከሰዓት፣ ጥቅምት 10"
            required
            value={amhDate}
            onChange={(e) => setAmhDate(e.target.value)}
          />
        </div>{" "}
        <div className="mt-2 flex flex-col">
          <label>Main Verse</label>
          <input
            type="text"
            className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 w-[75%] mt-1"
            placeholder="ሰንበት ከሰዓት፣ ጥቅምት 10"
            required
            value={amhDate}
            onChange={(e) => setAmhDate(e.target.value)}
          />
        </div>{" "}
        <div className="mt-2 flex flex-col">
          <label>Paragraph</label>
          <input
            type="text"
            className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 w-[75%] mt-1 h-16"
            placeholder="ሰንበት ከሰዓት፣ ጥቅምት 10"
            required
            value={amhDate}
            onChange={(e) => setAmhDate(e.target.value)}
          />
        </div>{" "}
        <div className="mt-2 flex flex-col">
          <label>Paragraph</label>
          <input
            type="text"
            className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 w-[75%] mt-1 h-16"
            placeholder="ሰንበት ከሰዓት፣ ጥቅምት 10"
            required
            value={amhDate}
            onChange={(e) => setAmhDate(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-4 text-primary-1 bg-accent-6 mt-2 px-2 py-1 rounded-sm max-w-[fit-content] hover:bg-accent-7 transition-all">
          <span className="whitespace-nowrap">Add Paragraph</span>
          <PlusCircle />
        </button>
      </form>
    </div>
  );
};

export default SSLForm;
