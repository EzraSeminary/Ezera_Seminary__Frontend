import Hero from "../../features/home/Hero";
import Intro from "../../features/home/Intro";
import Contents from "../../features/home/Contents";
import PopularCourses from "../../features/home/PopularCourses";
import Testimonials from "../../features/home/Testimonials";

const Home = () => {
  return (
    <div className="flex flex-col space-y-12 ">
      <Hero />
      <Intro />
      <Contents />
      <PopularCourses />
      <Testimonials />
    </div>
  );
};

export default Home;
