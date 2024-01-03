import Hero from "@/features/HomePageComponents/Hero";
import Intro from "@/features/HomePageComponents/Intro";
import Contents from "@/features/HomePageComponents/Contents";
import PopularCourses from "@/features/HomePageComponents/PopularCourses";
import Testimonials from "@/features/HomePageComponents/Testimonials";

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
