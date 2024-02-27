import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";

import { Devotion } from "@/redux/types"; // Import the Devotion type

const PreviousDevotionals = ({
  previousDevotions,
  setSelectedDevotion,
}: {
  previousDevotions: Devotion[];
  setSelectedDevotion: (devotion: Devotion) => void;
}) => {
  return (
    <div className="flex flex-col h-auto space-y-6 w-[100%] mx-auto ">
      <div className="w-[100%] flex justify-between items-center">
        <div className="w-[100%]">
          <h3 className="text-sm font-Lato-black text-accent-6">
            Explore Devotionals
          </h3>
          <h2 className="text-2xl font-Lato-black text-secondary-6 mb-2">
            Devotionals of Previous Days
          </h2>
          <hr className=" border-1 border-accent-6 w-[40%]" />
        </div>
        <div className="self-end w-auto">
          <Button
            // type="button"
            // className="border-2 w-[70%] border-accent-6 rounded-full  px-2 text-accent-6 text-xs"
            variant="outline"
            size="sm"
          >
            ሙሉ ተመልከት
          </Button>
        </div>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-3 w-[90%]  mx-auto pb-4">
        {previousDevotions.map((devotion) => (
          <div key={devotion._id} className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border text-center pb-4 font-nokia-bold">
            {/* <div className="rounded-lg shadow-xl  h-auto border-2 bg-[#fff] border-accent-6 text-secondary-6 overflow-hidden"> */}
              <div className="h-full w-full">
                <img
                  src={`https://ezra-seminary.mybese.tech/images/${devotion.image}`}
                  alt="Devotion Image"
                  className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-t-xl bg-secondary-1"
                  onClick={() => {
                    // open the devotion on click
                    // console.log("clicked");
                    setSelectedDevotion(devotion);
                  }}
                />
              </div>
              <div className="w-[90%] mx-auto flex justify-between items-center pb-3">
                <div className="w-[80%]">
                  <h1 className="font-customBold text-2xl text-justify mt-2">
                    {devotion.title}
                  </h1>

                  <h2 className="font-customBold text-lg text-[#EA9215]">
                    {/* {devotion.chapter} */}
                    {devotion.month} {devotion.day}
                  </h2>
                </div>
                <div className="w-[20%]">
                  <Button
                    // type="button"
                    // className="text-[#fff] bg-accent-6 text-xs font-nokia-bold w-[100%] border-2  rounded-full  px-2 hover: hover:bg-accent-7"
                    size="devotion"
                    onClick={() => {
                      // open the devotion on click
                      // console.log("clicked");
                      setSelectedDevotion(devotion);
                    }}
                  >
                    ክፈት
                  </Button>
                </div>
              </div>
            {/* </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

PreviousDevotionals.propTypes = {
  previousDevotions: PropTypes.array.isRequired,
  setSelectedDevotion: PropTypes.func.isRequired,
};

export default PreviousDevotionals;
