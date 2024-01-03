import Hero from "../../features/Home/Hero";
import Intro from "../../features/Home/Intro";
import Contents from "../../features/Home/Contents";
import PopularCourses from "../../features/Home/PopularCourses";
import Testimonials from "../../features/Home/Testimonials";

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
