import { useNavigate } from "react-router-dom";
import { BookOpenText, ArrowSquareUpRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import bible from "../../assets/bible.png";
import bibleNew from "../../assets/about-img.jpg";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { toEthiopian } from "ethiopian-date";
import { Devotion } from "@/redux/types";

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const gridSquareVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

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
    <div className="w-[90%] py-12 space-y-6 font-nokia-bold text-secondary-6 mx-auto lg:w-[90%]">
      <p className="text-xl lg:text-3xl  text-accent-6 border-b border-accent-6 pb-2">
        Daily Devotionals
      </p>
      {/* Today's verse */}
      <div className=" w-full mx-auto flex flex-col border-2 border-accent-6 mt-6 rounded-lg bg-primary-2 shadow-2xl p-4  space-y-6 lg:flex-row lg:items-start lg:gap-6 lg:justify-between lg:w-[90%]">
        <div className="h-48 md:w-[35%] lg:h-52  xl:h-64">
          <img src={bible} className="w-full  h-full object-cover rounded-lg" />
        </div>
        <div className="lg:w-[65%] lg:space-y-3">
          <div className="flex flex-row w-[100%] justify-between items-center">
            <div className="flex flex-row items-center gap-2">
              <BookOpenText size={32} weight="bold" className="text-accent-6" />
              <p className=" font-nokia-bold text-lg xl:text-xl">የዕለቱ ጥቅስ</p>
            </div>
            <button className="bg-accent-6 px-4 py-1 rounded-full">
              <p className="text-primary-1 text-sm xl:text-lg">Open</p>
            </button>
          </div>
          <div className="border-b border-accent-6 mt-2 mb-1" />
          <div>
            <p className="text-sm xl:text-lg">
              ”ስምህ እግዚአብሔር የሆነው አንተ ብቻ፣ በምድር ሁሉ ላይ ልዑል እንደ ሆንህ ይወቁ።“ መዝሙር 83:18
            </p>
          </div>
        </div>
      </div>

      {/* Continue studying */}
      <div className="flex flex-row justify-between items-center mt-4 border-t border-secondary-3 pt-4">
        <p className="text-lg lg:text-xl xl:text-2xl">Continue Studying</p>
        <button className="border border-accent-6 px-4 py-1 rounded-full">
          <p className="text-accent-6 text-sm">All Courses</p>
        </button>
      </div>
      {/* Continue studying contents */}
      <div className="w-full mx-auto  flex flex-col shadow-2xl   border border-accent-6 mt-4 rounded-lg p-4 lg:p-0 space-y-6 lg:space-y-0 lg:flex-row lg:items-start lg:justify-between   lg:w-[90%]">
        <div className="h-48  lg:h-52  xl:h-64 lg:w-[65%]">
          <img
            src={bibleNew}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="space-y-2 md:space-y-3 lg:w-[35%]   lg:flex lg:flex-col lg:justify-center lg:items-center lg:h-52  xl:h-64">
          <p className=" text-accent-6 text-lg xl:text-2xl  leading-tight">
            የአጠናን ዘዴዎች
          </p>
          <p className=" text-lg xl:text-xl leading-tight">
            ፍሬያማ የመጽሃፍ ቅዱስ አጠናን ዘዴዎች
          </p>
          <button className="bg-accent-6 px-4 py-2 rounded-full w-36 ">
            <p className="text-primary-1 font-nokia-bold text-sm text-center">
              ኮርሱን ክፈት
            </p>
          </button>
        </div>
      </div>

      {/* Study this week's SSL */}
      <div className="flex flex-row justify-between items-center mt-4">
        <p className=" text-secondary-6 text-lg lg:text-xl xl:text-2xl">
          Study this week's SSL
        </p>
        <button className="border border-accent-6 px-4 py-1 rounded-full">
          <p className=" text-accent-6 text-sm">All SSLs</p>
        </button>
      </div>
      {/* <div className="rounded-2 overflow-hidden"> */}
      {/* contensts */}
      <div className="flex flex-row shadow-2xl border border-accent-6 mt-4 rounded-lg p-4 gap-4 lg:gap-6  lg:w-[90%] mx-auto">
        <div className="h-auto w-32 md:w-[35%] lg:h-52  xl:h-64 ">
          <img
            src={bible}
            alt="Background"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-[65%] space-y-1 md:space-y-2 lg:pt-6">
          <h3 className=" text-accent-6 text-sm xl:text-lg leading-tight">
            መጽሐፈ መዝሙረ ዳዊት
          </h3>
          <h2 className=" text-lg xl:text-xl leading-tight">መጨረሻ የለሌው አምልኮ</h2>
          <div className="border-b border-accent-6" />
          <p className="text-xs xl:text-sm text-secondary-5">
            መጋቢት 6 - መጋቢት 12
            {/* <div className="flex flex-row items-center"> */}
            {/* <DateConverter

            gregorianDate="2023-05-01"
          />
          <span className="font-nokia-bold text-secondary-5"> - </span>
          <DateConverter
            gregorianDate="2023-05-07"
          /> */}
            {/* <p>መጋቢት 6 - መጋቢት 12</p>
            </div> */}
          </p>
          <button className="bg-accent-6 px-4 py-1 xl:py-2 rounded-full w-36">
            <span className="text-primary-1 text-sm  text-center">
              ትምህርቱን ክፈት
            </span>
          </button>
        </div>
      </div>
      {/* </div> */}

      {/* Discover Devotionals */}
      <div className="flex flex-row justify-between items-center mt-4">
        <h2 className=" text-secondary-6 text-lg lg:text-xl xl:text-2xl">
          Discover Devotionals
        </h2>
        <button className="border border-accent-6 px-4 py-1 rounded-full">
          <span className=" text-accent-6 text-sm">All Devotionals</span>
        </button>
      </div>
      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-row flex-wrap justify-between mt-4 lg:w-[90%] mx-auto"
      >
        {sampleData.slice(0, 4).map((item, index) => (
          <motion.div
            variants={gridSquareVariants}
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{ scale: 0.9 }}
            transition={{
              bounceDamping: 10,
              bounceStiffness: 600,
            }}
            key={index}
            className=" shadow-2xl w-[48%] gap-2 md:w-[49%] md:gap-3 lg:w-[32.5%] lg:gap-2 xl:gap-3 xl:w-[32.5%] mb-4 rounded-2 overflow-hidden relative cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full md:h-auto lg:h-48 xl:h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 h-full bg-accent-10 bg-opacity-60 rounded-lg">
              <ArrowSquareUpRight
                weight="fill"
                className="text-primary-1 text-lg md:text-xl lg:text-2xl xl:text-3xl absolute top-0 right-0 m-2"
              />
              <div className="absolute bottom-0 left-0 my-2 md:top-[65%] lg:top-[70%] xl:top-[73%]">
                <h3 className=" text-primary-1 text-sm xl:text-lg mx-2">
                  {item.title}
                </h3>
                <p className="text-xs xl:text-sm mx-2 text-accent-2">
                  {item.month} {item.day}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LoggedInHome;
