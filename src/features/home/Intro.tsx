import { useState, useEffect } from "react";
import YouTube from 'react-youtube';
import IntroSkeleton from "../../skeletons/IntroSkeleton";
import { motion } from "framer-motion";

const Intro = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // Skeleton loading
  if (isLoading) return <IntroSkeleton />;

  const opts = {
    height: '400px',
    width: '100%',
    playerVars: {
      autoplay: 0, // Do not autoplay the video.
    },
  };

  const videoId = "IQGdWVLskJg";

  return (
    <div className="pt-[7rem] mt-[85vh] md:mt-[96vh] md:pt-[3rem]  lg:mt-[96vh] lg:pt-[3rem] xl:mt-[96vh] xl:pt-[5.2rem]  md:flex md:flex-col md:items-center md:justify-center">
      <div className="w-4/5 mx-auto flex flex-col-reverse md:flex-row md:flex-wrap ">
        <div className="mt-12 w-full  md:mt-0 md:w-1/2 rounded-3xl relative ">
          <div className="w-full h-full rounded-3xl overflow-hidden">
            <YouTube
              videoId={videoId}
              opts={opts}
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="space-y-6 md:w-1/2 text-secondary-6 text-center md:items-center md:p-8">
          <motion.h2
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="font-nokia-bold text-2xl md:text-3xl   :text-4xl"
          >
            የእግዚአብሔር ቃል <span className="text-accent-5">የሕይወት እንጀራ</span> ነው!
          </motion.h2>
          <motion.hr
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="border-accent-5  my-4 w-full md:hidden  lg:block lg:mx-auto lg:w-4/5"
          />
          <motion.p
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            className=" font-nokia-light text-xs sm:text-sm lg:text-lg xl:text-2xl md:hidden lg:block"
          >
            “ልጄ ሆይ፥{" "}
            <span className="text-accent-5 font-nokia-bold">ቃሌን ጠብቅ</span>{" "}
            ትእዛዜንም በአንተ ዘንድ ሸሽግ። ትእዛዜን ጠብቅ{" "}
            <span className="font-nokia-bold "> በሕይወትም ትኖራለህ፤ </span> ሕጌንም{" "}
            <span className="font-nokia-bold "> እንደ ዓይንህ ብሌን ጠብቅ፤</span> በጣቶችህ
            እሰራቸው፤ በልብህ ጽላት ጻፋቸው።” ምሳሌ 7:1-3
          </motion.p>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
          className="hidden  pt-4 font-nokia-light w-[70%] mx-auto text-center md:block lg:hidden md:text-sm "
        >
          “ልጄ ሆይ፥ <span className="text-accent-5 font-nokia-bold">ቃሌን ጠብቅ</span>{" "}
          ትእዛዜንም በአንተ ዘንድ ሸሽግ። ትእዛዜን ጠብቅ{" "}
          <span className="font-nokia-bold text-[]"> በሕይወትም ትኖራለህ፤ </span> ሕጌንም{" "}
          <span className="font-nokia-bold text-[]"> እንደ ዓይንህ ብሌን ጠብቅ፤</span>{" "}
          በጣቶችህ እሰራቸው፤ በልብህ ጽላት ጻፋቸው።” ምሳሌ 7:1-3
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
        className="hidden  md:block lg:mt-10 text-center"
      >
        <hr className="border-accent-5 border-2 my-8 mx-auto w-[10%] lg:hidden" />
        <p className=" font-nokia-light text-xs md:text-sm lg:text-lg xl:text-xl text-secondary-6">
          በየዕለቱ <span className="font-nokia-bold"> መጽሃፍ ቅዱስን ለማጥናት </span> ይህንን
          መተግበሪያ <span className="font-nokia-bold text-[]"> በስልክዎት ላይ </span>{" "}
          ይጫኑ እና ይጠቀሙ።
        </p>
      </motion.div>
    </div>
  );
};

export default Intro;