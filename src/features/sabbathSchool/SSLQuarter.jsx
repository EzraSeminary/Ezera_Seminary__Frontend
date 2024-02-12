import { useParams, Link } from "react-router-dom";
import { useGetSSLOfQuarterQuery } from "./../../services/SabbathSchoolApi";
import DateConverter from "./DateConverter";

function SSLQuarter() {
  const { quarter } = useParams();
  const {
    data: lessonDetails,
    error,
    isLoading,
  } = useGetSSLOfQuarterQuery(quarter);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 w-[90%] md:w-[80%] py-12 font-nokia-bold text-secondary-6">
      <button
        className="text-accent-6 border border-accent-6 rounded-full my-2 px-4 py-1 hover:bg-accent-6 hover:text-primary-1 transition-all"
        onClick={() => window.history.back()}
      >
        All Sabbath School Lessons
      </button>
      <div className="flex flex-row gap-4">
        <div className="w-auto">
          <img
            src={lessonDetails.quarterly.cover}
            alt={lessonDetails.quarterly.title}
            className="rounded-md shadow-md"
            width={600}
          />
          <p className="text-right mt-2">
            {lessonDetails.quarterly.human_date}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl text-accent-6">
            {lessonDetails.quarterly.title}
          </div>
          <div className="text-lg my-4 leading-tight">
            {" "}
            {lessonDetails.quarterly.description}
          </div>
          {lessonDetails.lessons.map((item, index) => (
            <Link
              className="w-[60%] py-3 border border-secondary-2 hover:bg-secondary-1 rounded-md shadow-md px-4 my-2 flex justify-between items-center gap-4 transition-all"
              key={index}
              to={{
                pathname: `/sabbathSchool/${quarter}/lessons/${item.id}`,
                state: {
                  quarterlyTitle: lessonDetails.quarterly.title,
                  quarterlyCover: lessonDetails.quarterly.cover,
                },
              }}
            >
              <div className="flex text-2xl gap-3">
                <p className="text-4xl text-secondary-3">{index + 1}</p>
                <div>
                  <h2 className="whitespace-normal">{item.title}</h2>
                  <div className="flex text-lg text-secondary-3">
                    <DateConverter gregorianDate={item.start_date} />
                    &nbsp;- &nbsp;
                    <DateConverter gregorianDate={item.end_date} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SSLQuarter;
