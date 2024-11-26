import { useNavigate } from "react-router-dom";
import { BookOpenText, ArrowSquareUpRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import LoadingSkeleton from "@/skeletons/LoggedInHomeSkeleton";
import bible from "../../assets/bible.webp";
import bibleNew from "../../assets/about-img.webp";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { toEthiopian } from "ethiopian-date";
import { Devotion } from "@/types/devotionTypes";
import Footer from "@/components/Footer";

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
  const { data: devotions, error, isLoading } = useGetDevotionsQuery({ page: 1, limit: 10 });

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

  //Skeleton loading
  if (isLoading) return <LoadingSkeleton />;
  if (error) return `Error: ${(error as Error).message}`;

  if (!devotions || devotions.length === 0) {
    return <LoadingSkeleton />;
  }

  const today = new Date();
  const ethiopianDate = toEthiopian(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  const [, month, day] = ethiopianDate;
  const ethiopianMonth = ethiopianMonths[month];
  const todaysDevotion = devotions.data.find(
    (devotion) =>
      devotion.month === ethiopianMonth && Number(devotion.day) === day
  );

  // If there's no devotion for today, use the most recent one
  const latestDevotion = todaysDevotion || devotions.data[0];

  const handleOpenDevotion = () => {
    navigate("/devotion", { state: { selectedDevotion: latestDevotion } });
  };

  const handleViewDevotion = (devotion: Devotion) => {
    navigate("/devotion", { state: { selectedDevotion: devotion } });
  };

  return (
    <div className="absolute top-0 w-full">
      <div className="loggedIn-img bg-cover  w-full py-14  md:py-20 lg lg:py-28  flex  justify-center items-center pointer-events-none">
        <div className=" z-10 text-primary-1 align-middle  font-nokia-bold text-center">
          <div className=" text-2xl md:text-5xl">
            Welcome <span className="text-accent-6">Back</span>
          </div>
          <div className="text-lg md:text-3xl text-accent-6">እንኳን ደህና መጣችሁ</div>
        </div>
      </div>

      <div className="w-[90%]  space-y-12 py-12 font-nokia-bold text-secondary-6 mx-auto lg:w-[90%] lg:space-y-20 lg:py-16 xl:py-24 flex-1">
        {/*daily devotions and course */}
        <div className="flex flex-col space-y-6 h-auto  items-start justify-start w-full gap-2 md:flex-row  md:space-y-0  lg:w-[85%] xl:w-[90%] mx-auto">
          {/* daily devotionals conatiner*/}
          <div className="w-[90%] mx-auto flex-grow flex-shrink h-full">
            <p className="text-lg lg:text-xl xl:text-3xl  text-accent-6 border-b border-accent-6 pb-2 lg:w-[50%]">
              Daily<span className="text-secondary-6"> Devotionals</span>
            </p>
            {/* Today's verse */}

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
              className=" w-[90%]  mx-auto flex flex-col  border border-accent-6 mt-6 rounded-lg bg-primary-2 shadow-2xl p-4  space-y-4 cursor-pointer"
            >
              <div className="h-48  lg:h-52  xl:h-64">
                <img
                  src={`${latestDevotion.image}` || `${bible}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2 lg:space-y-3 ">
                <div className="flex flex-row w-[100%] justify-between items-center">
                  <div className="flex flex-row items-center gap-2">
                    <BookOpenText
                      // size={32}
                      weight="bold"
                      className="text-accent-6 text-2xl lg:text-3xl xl:text-4xl"
                    />
                    <p className=" font-nokia-bold text-sm lg:text-lg xl:text-2xl">
                      የዕለቱ ጥቅስ
                    </p>
                  </div>
                  <button
                    className="bg-accent-6 px-2 lg:px-4 lg:py-1 rounded-full"
                    onClick={handleOpenDevotion}
                  >
                    <p className="text-primary-1 text-xs lg:text-sm xl:text-xl">
                      Open
                    </p>
                  </button>
                </div>
                <div className="border-b border-accent-6 mt-2 mb-1" />
                <div>
                  <p className="text-xs lg:text-sm xl:text-lg">
                    {latestDevotion.verse}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Discover Courses Container*/}
          <div className="w-[90%] mx-auto flex-grow flex-shrink h-full">
            {/* Continue studying */}
            <div className="flex flex-row justify-between items-center border-b border-accent-6 pb-1">
              <p className="text-lg lg:text-xl xl:text-3xl">
                <span className="text-accent-6">Continue</span> Studying
              </p>
              <button className="border border-accent-6 text-accent-6 text-xs xl:text-sm  hover:text-primary-1 hover:bg-accent-6 px-2 xl:px-3 xl:py-1 xl:mb-1 mb-2 rounded-full">
                All Courses
              </button>
            </div>
            {/* Continue studying contents */}
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
              className="w-[90%] mx-auto flex flex-col  shadow-2xl   border border-accent-6 mt-6 rounded-lg p-4 pb-6 space-y-4 cursor-pointer"
              style={{ alignSelf: "stretch" }}
            >
              <div className="h-48  lg:h-52  xl:h-64 ">
                <img
                  src={bibleNew}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2 ">
                <p className=" text-accent-6 text-sm lg:text-sm xl:text-2xl leading-tight md:leading-none md:mt-2 lg:mt-0 xl:mt-1">
                  የአጠናን ዘዴዎች
                </p>
                <p className="text-xs lg:text-lg xl:text-xl  leading-tight  lg:leading-none md:pb-2">
                  ፍሬያማ የመጽሃፍ ቅዱስ አጠናን ዘዴዎች
                </p>
                <button className="bg-accent-6 px-4 lg:py-1   rounded-full w-max ">
                  <p className="text-primary-1 font-nokia-bold text-xs xl:text-sm text-center">
                    ኮርሱን ክፈት
                  </p>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* sabbath school and devotionals */}
        <div className="grid grid-cols-1 space-y-6  items-start justify-start w-full gap-2 lg:space-y-12  lg:w-[85%] xl:w-[90%] mx-auto ">
          {/* sabbath school container */}
          <div className="w-[90%] mx-auto ">
            {/* Study this week's SSL */}
            <div className="flex flex-row justify-between items-center border-b border-accent-6 pb-1">
              <p className=" text-secondary-6 text-lg lg:text-xl xl:text-3xl">
                <span className="text-accent-6">Study</span> this week's SSL
              </p>
              <button className="mb-1 border border-accent-6 hover:bg-accent-6 hover:text-primary-1  px-2 rounded-full text-accent-6 text-xs xl:px-3 xl:py-1 xl:mb-1 xl:text-sm">
                All SSLs
              </button>
            </div>
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
              className="flex flex-row shadow-2xl border border-accent-6 mt-6 rounded-lg p-4 gap-4 lg:gap-6   w-[90%] mx-auto cursor-pointer"
            >
              <div className="h-auto w-32 md:w-[40%] lg:w-[80%] lg:h-52  xl:h-64 ">
                <img
                  src={bible}
                  alt="Background"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="w-[65%] space-y-1 md:space-y-2 lg:pt-12 lg:text-center ">
                <h3 className=" text-accent-6 text-xs xl:text-xl leading-tight">
                  መጽሐፈ መዝሙረ ዳዊት
                </h3>
                <h2 className=" text-sm xl:text-2xl leading-tight">
                  መጨረሻ የለሌው አምልኮ
                </h2>
                <div className="border-b border-accent-6 lg:w-[70%] lg:mx-auto" />
                <p className="text-xs xl:text-lg text-secondary-5">
                  መጋቢት 6 - መጋቢት 12
                </p>
                <button className="bg-accent-6 px-3  lg:py-1 rounded-full w-max">
                  <span className="text-primary-1 text-xs lg:text-sm  text-center">
                    ትምህርቱን ክፈት
                  </span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Discover Devotionals Container */}
          <div className="w-[90%] mx-auto ">
            {/* Discover Devotionals */}
            <div className="flex flex-row justify-between items-start border-b border-accent-6 xl:items-center xl:mt-1">
              <h2 className=" text-secondary-6 text-lg lg:text-xl xl:text-3xl">
                <span className="text-accent-6"> Discover</span> Devotionals
              </h2>
              <button
                className="mb-2 "
                onClick={() => handleViewDevotion(devotions.data[0])}
              >
                <span className="border border-accent-6 hover:bg-accent-6 hover:text-primary-1 px-2 rounded-full text-accent-6 text-xs xl:px-3 xl:py-1 xl:mb-1 xl:text-sm">
                  All Devotionals
                </span>
              </button>
            </div>
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 justify-between mt-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto w-[90%]"
            >
              {devotions.data.slice(0, 4).map((devotion, index) => (
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
                  className=" shadow-2xl rounded-2 overflow-hidden relative cursor-pointer"
                  onClick={() => handleViewDevotion(devotion)}
                >
                  <img
                    src={`${devotion.image}` || `${bible}`}
                    alt={devotion.title}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 h-full bg-accent-10 bg-opacity-60 rounded-lg">
                    <ArrowSquareUpRight
                      weight="fill"
                      className="text-primary-1 text-lg md:text-xl lg:text-2xl xl:text-3xl absolute top-0 right-0 m-2"
                    />
                    <div className="absolute bottom-0 left-0 my-2 md:top-[65%] lg:top-[77%] xl:top-[79%]">
                      <h3 className=" text-primary-1 text-sm xl:text-lg mx-2">
                        {devotion.title}
                      </h3>
                      <p className="text-xs xl:text-sm mx-2 text-accent-2">
                        {devotion.month} {devotion.day}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoggedInHome;
