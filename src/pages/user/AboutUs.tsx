// import Slide from "../components/Slide";
// import Quiz from "../components/Quiz";
// import {motion} from "framer-motion";
// import {useRef} from "react";
import OurTeam from "../../features/about/OurTeams";
import Purpose from "../../features/about/Purpose";
import Footer from "@/components/Footer";

const AboutUs = () => {
  // const containerRef = useRef(null);
  // const isInView = useInView(containerRef, {once: true});
  // const mainContainer = useInView(containerRef, {once: true});
  return (
    <div className="flex flex-col min-h-screen absolute top-0 w-full">
      <div className="h-auto space-y-8 lg:space-y-12 flex-1">
        <div className="about-img bg-cover  w-full py-14  md:py-20 lg:py-28   flex  justify-center items-center pointer-events-none">
          <div className=" z-10 text-primary-1 align-middle font-bold text-center">
            <div className=" text-2xl md:text-5xl">
              About <span className="text-accent-6">Us</span>
            </div>
            <div className="text-lg md:text-3xl text-accent-6">ስለ እኛ</div>
          </div>
        </div>
        <Purpose />
        <OurTeam />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
