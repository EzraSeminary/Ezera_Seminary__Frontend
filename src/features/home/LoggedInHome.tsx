// import DateConverter from "../sabbathSchool/DateConverter";
// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenText, ArrowSquareUpRight } from "@phosphor-icons/react";
import bible from "../../assets/bible.png";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { toEthiopian } from "ethiopian-date";
import { Devotion } from "@/redux/types";

const LoggedInHome = () => {
  const { data: devotions, error, isLoading } = useGetDevotionsQuery();
  const ethiopianMonths = [
    "", // There is no month 0
    "መስከረም",
    "ጥቅምት",
    "ህዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዝያ",
    "ግንቦት",
    "ሰኔ",
    "ሐምሌ",
    "ነሐሴ",
    "ጳጉሜ", // 13th month
  ];

  const navigate = useNavigate();

  if (isLoading) return "Loading...";
  if (error) return `Error: ${(error as Error).message}`;

  if (!devotions || devotions.length === 0) {
    return <div>No devotions available</div>;
  }

  const today = new Date();
  const ethiopianDate = toEthiopian(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  const [, month, day] = ethiopianDate;
  const ethiopianMonth = ethiopianMonths[month];
  const todaysDevotion = devotions.find(
    (devotion) =>
      devotion.month === ethiopianMonth && Number(devotion.day) === day
  );

  // If there's no devotion for today, use the most recent one
  const latestDevotion = todaysDevotion || devotions[0];

  const handleOpenDevotion = () => {
    navigate("/devotion", { state: { selectedDevotion: latestDevotion } });
  };

  const handleViewDevotion = (devotion: Devotion) => {
    navigate("/devotion", { state: { selectedDevotion: devotion } });
  };

  return (
    <div className="w-90% p-4 font-nokia-bold text-secondary-6">
      <p className="text-2xl  text-accent-6 border-b border-accent-6 pb-2">
        Daily Devotionals
      </p>
      <div className="border-2 border-accent-6 mt-6 rounded-lg bg-primary-2 shadow-lg px-4 py-4">
        <div className="flex flex-row w-[100%] justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            <BookOpenText size={32} weight="bold" className="text-accent-6" />
            <p className=" font-nokia-bold text-lg">የዕለቱ ጥቅስ</p>
          </div>
          <button
            className="bg-accent-6 px-4 py-1 rounded-full"
            onClick={handleOpenDevotion}
          >
            <p className="text-primary-1 text-sm">Open</p>
          </button>
        </div>
        <div className="border-b border-accent-6 mt-2 mb-1" />
        {latestDevotion && (
          <div>
            <p className="text-lg">{latestDevotion.verse}</p>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between items-center mt-4 border-t border-secondary-3 pt-4">
        <p className="text-lg">Continue Studying</p>
        <button className="border border-accent-6 px-4 py-1 rounded-full">
          <p className="text-accent-6 text-sm">All Courses</p>
        </button>
      </div>
      <div className="border border-accent-6 mt-4 rounded-lg p-2">
        <div className="h-48">
          <img src={bible} className="w-full h-full object-cover rounded-lg" />
        </div>
        <p className=" text-accent-6 text-lg mt-2 leading-tight">የአጠናን ዘዴዎች</p>
        <p className=" text-xl leading-tight">ፍሬያማ የመጽሃፍ ቅዱስ አጠናን ዘዴዎች</p>
        <button className="bg-accent-6 px-4 py-2 rounded-full w-36 mt-2">
          <p className="text-primary-1 font-nokia-bold text-sm text-center">
            ኮርሱን ክፈት
          </p>
        </button>
      </div>
      <div className="flex flex-row justify-between items-center mt-4">
        <p className=" text-secondary-4 text-lg">Study this week's SSL</p>
        <button className="border border-accent-6 px-4 py-1 rounded-full">
          <p className=" text-accent-6 text-sm">All SSLs</p>
        </button>
      </div>
      <div className="rounded-2 overflow-hidden">
        <div className="flex flex-row border border-accent-6 mt-4 rounded-lg p-2 gap-2">
          <div className="h-auto w-32">
            <img
              src={bible}
              alt="Background"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="w-65%">
            <h3 className=" text-accent-6 text-sm leading-tight">
              መጽሐፈ መዝሙረ ዳዊት
            </h3>
            <h2 className=" text-lg leading-tight">መጨረሻ የለሌው አምልኮ</h2>
            <div className="border-b border-accent-6 mt-1" />
            <p className="text-xs text-secondary-5">
              <div className="flex flex-row items-center">
                {/* <DateConverter
            gregorianDate="2023-05-01"
          />
          <span className="font-nokia-bold text-secondary-5"> - </span>
          <DateConverter
            gregorianDate="2023-05-07"
          /> */}
                <p>መጋቢት 6 - መጋቢት 12</p>
              </div>
            </p>
            <button className="bg-accent-6 px-4 py-1 rounded-full w-36 mt-1">
              <span className="text-primary-1 text-sm text-center">
                ትምህርቱን ክፈት
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-between mt-4">
        {devotions.slice(0, 4).map((devotion, index) => (
          <div
            key={index}
            className="w-[47.5%] mb-4 rounded-2 overflow-hidden relative aspect-square"
            onClick={() => handleViewDevotion(devotion)}
          >
            <img
              src={
                `https://ezra-seminary.mybese.tech/images/${devotion.image}` ||
                `${bible}`
              }
              alt={devotion.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-accent-10 bg-opacity-60 rounded-lg">
              <ArrowSquareUpRight
                size={32}
                weight="fill"
                className="text-primary-1 absolute top-0 right-0 m-2"
              />
              <div className="absolute bottom-0 left-0 my-2">
                <h3 className=" text-primary-1 text-lg mx-2">
                  {devotion.title}
                </h3>
                <p className="text-sm mx-2 text-accent-2">
                  {devotion.month} {devotion.day}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoggedInHome;
