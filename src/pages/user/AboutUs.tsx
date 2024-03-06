// import Slide from "../components/Slide";
// import Quiz from "../components/Quiz";
import OurTeam from "../../features/about/OurTeams";
import Purpose from "../../features/about/Purpose";

const AboutUs = () => {
   return (
    <div className="h-auto space-y-8 lg:space-y-12">
     
      <div className="about-img bg-cover  w-full h-[35%] py-4  md:py-6 lg:py-20 flex  justify-center items-center pointer-events-none">
        
        <div className=" z-10 text-primary-1 align-middle font-bold  text-center">
          <div className=" text-2xl md:text-5xl">About Us</div>
          <div className="text-lg md:text-3xl">ስለ እኛ</div>
        </div>
      </div>
      <Purpose />
      <OurTeam />
    </div>
  );
};

export default AboutUs;
