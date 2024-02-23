import Hero from "../../features/home/Hero";
import Intro from "../../features/home/Intro";
import Contents from "../../features/home/Contents";
import LatestCourses from "../../features/home/LatestCourses";
import Testimonials from "../../features/home/Testimonials";

const Home = () => {
  return (
    <div className="flex flex-col gap-12 min-h-screen">
      <Hero />
      <Intro />
      <Contents />
      <LatestCourses />
      <Testimonials />
    </div>
  );
};

export default Home;
