import LoadingPage from "@/pages/user/LoadingPage";
import { useParams } from "react-router-dom";
import { useGetSSLOfQuarterQuery } from "./../../services/SabbathSchoolApi";
import DateConverter from "./DateConverter";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

type Lesson = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  // ... any other lesson properties
};

type LessonDetails = {
  quarterly: {
    cover: string;
    title: string;
    description: string;
    human_date?: string; // assuming human_date is optional
    // ... other quarterly properties
  };
  lessons: Lesson[];
};

function SSLQuarter() {
  const { quarter } = useParams<{ quarter: string }>(); // Specify the type of 'quarter' param
  const {
    data: lessonDetails,
    error,
    isLoading,
  } = useGetSSLOfQuarterQuery(quarter);
  const navigate = useNavigate();

  const details = lessonDetails as LessonDetails;

  if (isLoading) return <LoadingPage />;
  if (error && "message" in error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col min-h-screen  w-full">
      <div className="container mx-auto px-4 w-[90%] md:w-[80%] py-12 font-nokia-bold text-secondary-6 flex-1">
        <button
          className="text-accent-6 border border-accent-6 rounded-full my-2 px-4 py-1 hover:bg-accent-6 hover:text-primary-1 transition-all"
          onClick={() => window.history.back()}
        >
          All Sabbath School Lessons
        </button>

        {/* container */}
        <div className="pt-6 flex flex-col md:flex-row gap-4 lg:gap-8">
          {/* Render the quarterly cover */}
          <div className="w-full  lg:w-[80%]">
            <img
              src={details.quarterly.cover}
              alt={details.quarterly.title}
              className="rounded-md h-48 w-auto mx-auto md:h-auto shadow-md "
              // width={600}
            />

            <p className="hidden md:block text-right mt-2 lg:text-left xl:text-xl xl:text-center xl:mt-4">
              {details.quarterly.human_date}
            </p>
          </div>

          {/* Render the quarterly title, description, and lessons */}
          <div className="flex flex-col space-y-3 xl:space-y-4">
            <div className=" text-center">
              <h1 className="text-2xl lg:text-3xl xl:text-4xl text-accent-6">
                {details.quarterly.title}
              </h1>
              <p className="block md:hidden text-sm  ">
                {details.quarterly.human_date}
              </p>
            </div>

            <div className="text-sm lg:text-lg xl:text-xl lg:leading-relaxed lg:tracking-wide xl:tracking-wide xl:leading-relaxed  text-justify">
              {" "}
              {details.quarterly.description}
            </div>
            {details.lessons.map((item, index: number) => (
              <button
                className=" py-3 border border-secondary-2 hover:bg-secondary-1 rounded-md shadow-md px-4 my-2 flex   justify-between items-center gap-4 transition-all cursor-pointer"
                key={index}
                onClick={() =>
                  navigate(`/sabbathSchool/${quarter}/lessons/${item.id}`, {
                    state: {
                      quarterlyTitle: details.quarterly.title,
                      quarterlyCover: details.quarterly.cover,
                    },
                  })
                }
              >
                <div className="flex flex-grow items-center justify-start text-2xl gap-4">
                  <p className="text-2xl  xl:text-3xl ">{index + 1}</p>
                  <div>
                    <h2 className=" text-lg lg:text-xl xl:text-2xl text-left">
                      {item.title}
                    </h2>
                    <div className="flex text-sm xl:text-lg text-secondary-3">
                      <DateConverter gregorianDate={item.start_date} />
                      &nbsp;- &nbsp;
                      <DateConverter gregorianDate={item.end_date} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SSLQuarter;
