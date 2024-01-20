import PropTypes from "prop-types";

const Categories = ({ title }) => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xs md:text-sm font-Lato-bold  text-accent-5">
          Explore different topics
        </h3>
        <h2 className="text-xl md:text-2xl font-Lato-bold  text-secondary-6">
          {title}
        </h2>
      </div>
      <hr className="border-accent-5 border-1 w-[100%] pb-3" />
      <div className="flex flex-col w-[100%] justify-center items-center  mx-auto space-y-6 md:flex-row md:space-x-3 md:space-y-0">
        <div className="flex flex-col w-[90%] md:w-[33.3%] border-accent-5 border-2  shadow-2xl rounded-t-3xl md:rounded-xl">
          <div className="mx-auto w-[100%] ">
            <img
              className="w-full object-cover"
              src="../assets/Category-img-1.svg"
              alt=""
            />
          </div>
          <div className="bg-secondary-6 bg-opacity-90 w-[100%]">
            <div className="flex justify-between items-center w-[90%] text-center py-4 font-nokia-bold mx-auto">
              <div className="flex flex-col justify-center items-start">
                <h2 className=" text-[#fff] text-lg md:text-2xl ">ርዕሳዊ ጥናት</h2>
                <p className="text-accent-11 font-nokia-light text-xs md:text-lg mb-4 md:w-[80%]">
                  የተለየ ርዕስን መሰረት ያደረጉ ጥናቶች
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-accent-6 text-primary-6 px-5 py-1 rounded-full font-nokia-bold text-xs hover:bg-accent-7"
                >
                  ክፈት
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[90%] md:w-[33.3%] border-accent-5 border-2  shadow-2xl rounded-t-3xl md:rounded-xl">
          <div className="mx-auto w-[100%] ">
            <img
              className="w-full object-cover"
              src="../assets/Category-img-2.svg"
              alt=""
            />
          </div>
          <div className="bg-secondary-6 bg-opacity-90 w-[100%]">
            <div className="flex justify-between items-center w-[90%] text-center py-4 font-nokia-bold mx-auto">
              <div className="flex flex-col justify-center items-start">
                <h2 className=" text-[#fff] text-lg md:text-2xl ">
                  የባለታሪክ ጥናት
                </h2>
                <p className="text-accent-11 font-nokia-light text-xs md:text-lg mb-4 md:w-[80%]">
                  የሰዎችን ታሪክ መሰረት ያደረጉ ጥናቶች
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-accent-6 text-primary-6 px-5 py-1 rounded-full font-nokia-bold text-xs hover:bg-accent-7"
                >
                  ክፈት
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[90%] md:w-[33.3%] border-accent-5 border-2  shadow-2xl rounded-t-3xl md:rounded-xl">
          <div className="mx-auto w-[100%] ">
            <img
              className="w-full object-cover"
              src="../assets/Category-img-3.svg"
              alt=""
            />
          </div>
          <div className="bg-secondary-6 bg-opacity-90 w-[100%]">
            <div className="flex justify-between items-center w-[90%] text-center py-4 font-nokia-bold mx-auto">
              <div className="flex flex-col justify-center items-start">
                <h2 className=" text-[#fff] text-lg md:text-2xl ">የመጽሃፍ ጥናት</h2>
                <p className="text-accent-11 font-nokia-light text-xs md:text-lg mb-4 md:w-[90%]">
                  የተለየ መጽሃፍን መሰረት ያደርጉ ጥናቶች
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-accent-6 text-primary-6 px-5 py-1 rounded-full font-nokia-bold text-xs hover:bg-accent-7"
                >
                  ክፈት
                </button>
              </div>
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
