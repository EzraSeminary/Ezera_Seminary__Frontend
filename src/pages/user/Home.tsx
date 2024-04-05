import Hero from "../../features/home/Hero";
import Intro from "../../features/home/Intro";
import Contents from "../../features/home/Contents";
import LatestCourses from "../../features/home/LatestCourses";
import Testimonials from "../../features/home/Testimonials";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-col flex-1">
        <Hero />
        <Intro />
        <Contents />
        <LatestCourses />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
