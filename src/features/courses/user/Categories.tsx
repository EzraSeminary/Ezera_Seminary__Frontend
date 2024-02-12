import PropTypes from "prop-types";
import category1 from "../../../assets/Category-img-1.svg";
import category2 from "../../../assets/Category-img-2.svg";
import category3 from "../../../assets/Category-img-3.svg";

interface CategoriesProps {
  title: string;
}

const Categories: React.FC<CategoriesProps> = ({ title }) => {
  return (
    <div className="space-y-3">

      {/* Container for Title of the page */}
      <div>

        <h2 className="text-3xl font-nokia-bold text-secondary-6 ">
          {title}
        </h2>
        <h3 className="text-xs md:text-sm font-Lato-bold  text-accent-5">
          Explore different topics
        </h3>
      </div>
      <hr className="border-accent-5 border-1 w-[10 0%] md:w-[30%] pb-3" />

      {/* Container for Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">

        {/* Category 1 */}
        <div className="bg-secondary-6  space-y-3  font-nokia-bold rounded-xl shadow-2xl h-auto w-full border-accent-5 border-2">

          {/* Image */}
          <div className="mx-auto w-full ">
            <img className="w-full " src={category1} alt="" />
          </div>

          {/* Container for Title, Description and button */}
          <div className="flex justify-between items-center w-[90%] md:w-[100%]  font-nokia-bold mx-auto pb-3 pl-2 md:pl-5">

            {/* Title and Description */}
            <div className="flex flex-col justify-center items-start">
              <h2 className=" text-[#fff]  text-lg lg:text-xl xl:text-2xl">ርዕሳዊ ጥናት</h2>
              <p className="text-accent-11 font-nokia-light  text-sm xl:text-lg ">
                የተለየ ርዕስን መሰረት ያደረጉ ጥናቶች
              </p>
            </div>

            {/* Button */}
            <div>
              <button
                type="button"
                className=" text-accent-6 hover:bg-accent-6  font-nokia-bold border-2 border-accent-6 border-opacity-80 rounded-full px-4 md:px-7 py-1 text-xs1 hover:text-white transition-all w-max mx-auto block md:mx-6"
              >
                ክፈት
              </button>
            </div>
          </div>
        </div>

        {/* Category 2 */}
        <div className="bg-secondary-6  space-y-3  font-nokia-bold rounded-xl shadow-2xl h-auto w-full border-accent-5 border-2">

          {/* Image */}
          <div className="mx-auto w-full ">
            <img className="w-full " src={category2} alt="" />
          </div>

          {/* Container for Title, Description and button */}
          <div className="flex justify-between items-center w-[90%] md:w-[100%]  font-nokia-bold mx-auto pb-3 pl-2 md:pl-5">

            {/* Title and Description */}
            <div className="flex flex-col justify-center items-start">
              <h2 className=" text-[#fff]  text-lg lg:text-xl xl:text-2xl">የባለታሪክ ጥናት</h2>
              <p className="text-accent-11 font-nokia-light  text-sm xl:text-lg ">
                የሰዎችን ታሪክ መሰረት ያደረጉ ጥናቶች
              </p>
            </div>

            {/* Button */}
            <div>
              <button
                type="button"
                className=" text-accent-6 hover:bg-accent-6  font-nokia-bold border-2 border-accent-6 border-opacity-80 rounded-full px-4 md:px-7 py-1 text-xs1 hover:text-white transition-all w-max mx-auto block md:mx-6"
              >
                ክፈት
              </button>
            </div>
          </div>
        </div>

        {/* Category 3 */}
        <div className="bg-secondary-6  space-y-3  font-nokia-bold rounded-xl shadow-2xl h-auto w-full border-accent-5 border-2">

          {/* Image */}
          <div className="mx-auto w-full ">
            <img className="w-full " src={category3} alt="" />
          </div>

          {/* Container for Title, Description and button */}
          <div className="flex justify-between items-center w-[90%] md:w-[100%]  font-nokia-bold mx-auto pb-3 pl-2 md:pl-5">

            {/* Title and Description */}
            <div className="flex flex-col justify-center items-start">
              <h2 className=" text-[#fff]  text-lg lg:text-xl xl:text-2xl">የመጽሃፍ ጥናት</h2>
              <p className="text-accent-11 font-nokia-light  text-sm xl:text-lg ">
                የተለየ መጽሃፍን መሰረት ያደርጉ ጥናቶች
              </p>
            </div>

            {/* Button */}
            <div>
              <button
                type="button"
                className=" text-accent-6 hover:bg-accent-6  font-nokia-bold border-2 border-accent-6 border-opacity-80 rounded-full px-4 md:px-7 py-1 text-xs1 hover:text-white transition-all w-max mx-auto block md:mx-6"
              >
                ክፈት
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Categories.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Categories;
