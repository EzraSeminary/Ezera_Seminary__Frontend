import { useState } from 'react';
// import YouTube from 'react-youtube';
import { motion } from 'framer-motion';
import introVideo from "../../videos/Tsegaw-Melak-1.mp4";
import introVideoTumb from "../../assets/Tsegaw-Melak-2.png";
import { PlayCircle } from "@phosphor-icons/react";

const Intro = () => {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
  };

  // const opts = {
  //   height: '280px',
  //   width: '100%',
  //   playerVars: {
  //     autoplay: 1 // Tell the player to autoplay the video.
  //   },
  // };

  // const src = "YaAligpJSJw?si=O_kbJG-JEIxwZk82";
  // const videoId = "YaAligpJSJw?si=O_kbJG-JEIxwZk82";
  return (
    <div className="pt-[10rem] mt-[80vh] md:mt-[96vh] md:pt-[5rem]  lg:mt-[96vh] lg:pt-[5.5rem] xl:mt-[96vh] xl:pt-[5.2rem]  md:flex md:flex-col md:items-center md:justify-center">
      <div className="w-4/5 mx-auto flex flex-col-reverse md:flex-row md:flex-wrap ">
        <div className="mt-12 w-full  md:mt-0 md:w-1/2 rounded-3xl relative ">
          {
            !playing ? (
              <div className="cursor-pointer hover:opacity-80 transition-all z-0">
                <div className="w-full h-0 pb-[62%] relative">
                  <PlayCircle
                    size={63}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400  z-10"
                    onClick={handlePlay}
                  />
                </div>
                <img
                  src={introVideoTumb}
                  alt="Video Thumbnail"
                  className="absolute top-0 left-0 w-full h-auto rounded-3xl"
                  onClick={handlePlay}
                />
              </div>
            ) : (
              //   <div className="w-full h-full rounded-3xl overflow-hidden">
              //   <YouTube
              //     videoId={videoId}
              //     opts={opts}
              //     className="w-full h-full"
              //   />
              // </div>
              <video controls autoPlay className="w-full h-auto rounded-3xl">
                <source src={introVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
          }
        </div>
        <div className="space-y-6 md:w-1/2 text-secondary-6 text-center md:items-center md:p-8">
        <motion.h2
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease:"easeOut", delay: 0.4}} 
          className="font-nokia-bold text-2xl md:text-3xl   :text-4xl">
            የእግዚአብሔር ቃል <span className="text-accent-5">የሕይወት እንጀራ</span> ነው!
          </motion.h2>
          <motion.hr 
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, ease:"easeOut", delay: 0.5}} 
           className="border-accent-5  my-4 w-full md:hidden  lg:block lg:mx-auto lg:w-4/5" />
             <motion.p 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease:"easeOut", delay: 0.6}} 
          className=" font-nokia-light text-xs sm:text-sm lg:text-lg xl:text-2xl md:hidden lg:block">
            “ልጄ ሆይ፥{" "}
            <span className="text-accent-5 font-nokia-bold">ቃሌን ጠብቅ</span>{" "}
            ትእዛዜንም በአንተ ዘንድ ሸሽግ። ትእዛዜን ጠብቅ{" "}
            <span className="font-nokia-bold "> በሕይወትም ትኖራለህ፤ </span>{" "}
            ሕጌንም{" "}
            <span className="font-nokia-bold "> እንደ ዓይንህ ብሌን ጠብቅ፤</span>{" "}
            በጣቶችህ እሰራቸው፤ በልብህ ጽላት ጻፋቸው።” ምሳሌ 7:1-3
          </motion.p>
        </div>
        <motion.p 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease:"easeOut", delay: 0.7}}  
        className="hidden  pt-4 font-nokia-light w-[70%] mx-auto text-center md:block lg:hidden md:text-sm ">
          “ልጄ ሆይ፥{" "}
          <span className="text-accent-5 font-nokia-bold">ቃሌን ጠብቅ</span>{" "}
          ትእዛዜንም በአንተ ዘንድ ሸሽግ። ትእዛዜን ጠብቅ{" "}
          <span className="font-nokia-bold text-[]"> በሕይወትም ትኖራለህ፤ </span>{" "}
          ሕጌንም{" "}
          <span className="font-nokia-bold text-[]"> እንደ ዓይንህ ብሌን ጠብቅ፤</span>{" "}
          በጣቶችህ እሰራቸው፤ በልብህ ጽላት ጻፋቸው።” ምሳሌ 7:1-3
        </motion.p>
      </div>
      <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease:"easeOut", delay: 0.7}}  
      className="hidden  md:block lg:mt-10 text-center">
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
