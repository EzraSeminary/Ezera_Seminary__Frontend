import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import LoadingPage from "@/pages/user/LoadingPage";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  useGetSSLOfDayQuery,
  useGetSSLOfQuarterQuery,
} from "./../../services/SabbathSchoolApi";
import DateConverter from "./DateConverter";
import Footer from "@/components/Footer";
function SSLDay() {
  const { quarter, id } = useParams();
  const {
    data: lessonDetails,
    error: lessonError,
    isLoading: lessonIsLoading,
  } = useGetSSLOfDayQuery({ path: quarter, id: id });
  const {
    data: quarterDetails,
    error: quarterError,
    isLoading: quarterIsLoading,
  } = useGetSSLOfQuarterQuery(quarter);
  const daysOfWeek = ["ቅዳሜ", "እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ"];
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [selectedDayId, setSelectedDayId] = useState(null);

  useEffect(() => {
    if (lessonDetails?.days?.length && !selectedDayId) {
      const firstDayId = lessonDetails.days[0].id;
      setSelectedDayId(firstDayId);
      navigate(
        `/sabbathSchool/${quarter}/lessons/${id}/days/${firstDayId}/read`,
        { replace: true }
      );
    }
  }, [lessonDetails, quarter, id, selectedDayId, navigate]);

  if (lessonIsLoading || quarterIsLoading) return <LoadingPage />;

  if (lessonError && "message" in lessonError)
    return <div>Error: {lessonError.message}</div>;
  if (quarterError && "message" in quarterError)
    return <div>Error: {quarterError.message}</div>;

  if (!quarterDetails || !lessonDetails) return <div>Missing data...</div>;

  return (
    <div className="flex flex-col min-h-screen  w-full">
      <div className="container mx-auto px-4 w-[95%] md:w-[90%] py-12 font-nokia-bold text-secondary-6 flex-1 ">
        <div className=" flex w-full gap-3 md:gap-6 lg:gap-8 justify-between items-start">
          <div className="sticky top-[10%] bottom-0  flex flex-col w-[20%] space-y-2">
            <div className="flex flex-col gap-2">
              {quarterDetails && quarterDetails.quarterly && (
                <img
                  src={quarterDetails.quarterly.cover}
                  alt={quarterDetails.quarterly.title}
                  className="rounded-md"
                />
              )}
              {quarterDetails && quarterDetails.quarterly && (
                <div className="hidden md:flex text-sm xl:text-lg text-secondary-3">
                  <DateConverter
                    gregorianDate={lessonDetails.lesson.start_date}
                  />
                  &nbsp;- &nbsp;
                  <DateConverter
                    gregorianDate={lessonDetails.lesson.end_date}
                  />
                </div>
              )}
            </div>
            <button
              className="hidden md:block text-2xl mb-4 text-right leading-10 hover:text-accent-7 transition-all"
              onClick={goBack}
            >
              {quarterDetails.quarterly.title}
            </button>
            <div className="flex flex-col gap-2">
              {lessonDetails.days.map(
                (
                  item: {
                    id: SetStateAction<null>;
                    date: string;
                    title:
                      | string
                      | number
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<unknown>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | null
                      | undefined;
                  },
                  index: Key | null | undefined
                ) => (
                  <Link
                    key={index}
                    className={`flex flex-col  md:text-right px-2 border border-secondary-3 rounded-md lg:space-y-2 lg:py-2 ${
                      item.id === selectedDayId ? "bg-secondary-1" : ""
                    }`}
                    to={`/sabbathSchool/${quarter}/lessons/${id}/days/${item.id}/read`}
                    onClick={() => setSelectedDayId(item.id)}
                  >
                    <p className="flex flex-row text-secondary-3 text-xs xl:text-sm  md:justify-end md:hidden">
                      {daysOfWeek[(index as number) % 7]}፣&nbsp;&nbsp;
                    </p>
                    <p className="hidden md:flex flex-row text-secondary-3 text-xs lg:text-sm justify-end">
                      {daysOfWeek[(index as number) % 7]}፣&nbsp;&nbsp;
                      <DateConverter gregorianDate={item.date} />
                    </p>

                    <p className="hidden md:block mb-2 text-lg lg:text-xl xl:text-xl">
                      {item.title}
                    </p>
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="w-[80%]">
            <Outlet context={{ selectedDayId }} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SSLDay;
