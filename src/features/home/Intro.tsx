import { useState } from 'react';
// import YouTube from 'react-youtube';
import introVideo from "../../assets/Tsegaw-Melak-1.mp4";
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

      </div>
    </div>
  );
};

export default Intro;
