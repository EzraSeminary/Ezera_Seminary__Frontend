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
      <div className=" flex flex-col items-center justify-center space-y-4 ">
        <h1 className="text-3xl font-nokia-bold text-secondary-6 text-center">
          Our Contents
        </h1>
        <hr className="border-accent-5 border-1 w-[90%] pb-3" />

      </div>
    </div>
  );
};

export default Contents;
