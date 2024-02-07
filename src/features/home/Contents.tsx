import { useNavigate } from 'react-router-dom';
import content1 from "../../assets/content-1.svg";
import content2 from "../../assets/content-2.svg";
import content3 from "../../assets/content-3.svg";

const Contents = () => {

  const navigate = useNavigate();

  {/* Navigate to the course page */ }
  const handleCourseClick = () => {
    navigate('/courses');
  };

  {/* Navigate to the sabbath school page */ }
  const handleSabathSchoolClick = () => {
    navigate('/sabbathSchool');
  };

  {/* Navigate to the devotion page */ }
  const handleDevotionClick = () => {
    navigate('/devotion');
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Contents section */}
      <div className=" flex flex-col items-center justify-center space-y-4 ">
        {/* Title of the page */}
        <h1 className="text-3xl font-nokia-bold text-secondary-6 text-center">
          Our Contents
        </h1>
        <hr className="border-accent-5 border-1 w-[90%] pb-3" />
        {/* container of the Contents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {/* Content 1 */}
          <div className="bg-secondary-6 bg-opacity-90 text-center pb-4 font-nokia-bold rounded-xl shadow-2xl">
            {/* Image of the content */}
            <div className="mx-auto w-[100%]">
              <img className="w-full" src={content1} alt="content1" />
            </div>
            {/* Texts and button of the content */}
            <h2 className="text-accent-5 text-lg lg:text-xl xl:text-2xl mt-4">Course Study</h2>
            <p className="text-[#fff] font-nokia-bold text-sm xl:text-lg mb-4">
              Study on specific bible topics.
            </p>
            <button
              type="button"
              className=" bg-white text-secondary-6 font-nokia-bold border-2 border-white border-opacity-80 rounded-full px-7 py-1 text-xs1 hover:bg-secondary-6 hover:text-white transition-all w-max mx-auto block"
              onClick={handleCourseClick}
            >
              See More
            </button>
          </div>
          {/* Content 2 */}
          <div className="bg-secondary-6 bg-opacity-90 text-center pb-4 font-nokia-bold rounded-xl shadow-2xl">
            {/* Image of the content */}
            <div className="mx-auto w-[100%]">
              <img className="w-full" src={content2} alt="content2" />
            </div>
            {/* Texts and button of the content */}
            <h2 className="text-accent-5 text-lg lg:text-xl xl:text-2xl mt-4">Sabbath School Study</h2>
            <p className="text-[#fff] font-nokia-bold text-sm xl:text-lg mb-4">
              Quarterly bible study on a topic.
            </p>
            <button
              type="button"
              className="bg-white text-secondary-6 font-nokia-bold border-2 border-white border-opacity-80 rounded-full px-7 py-1 text-xs1 hover:bg-secondary-6 hover:text-white transition-all w-max mx-auto block"
              onClick={handleSabathSchoolClick}
            >
              See More
            </button>
          </div>

          <div className="bg-secondary-6 bg-opacity-90 text-center pb-4 font-nokia-bold rounded-xl shadow-2xl">
            {/* Image of the content */}
            <div className="mx-auto w-[100%]">
              <img className="w-full" src={content3} alt="content3" />
            </div>
            {/* Texts and button of the content */}
            <h2 className="text-accent-5 text-lg lg:text-xl xl:text-2xl mt-4">Devotional Study</h2>
            <p className="text-[#fff] font-nokia-bold text-sm xl:text-lg mb-4">
              Daily devotional text study.
            </p>
            <button
              type="button"
              className=" bg-white text-secondary-6 font-nokia-bold border-2 border-white border-opacity-80 rounded-full px-7 py-1 text-xs1 hover:bg-secondary-6 hover:text-white transition-all w-max mx-auto block"
              onClick={handleDevotionClick}
            >
              See More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contents;
