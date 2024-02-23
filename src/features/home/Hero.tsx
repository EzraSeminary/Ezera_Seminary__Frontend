import googlePlay from "../../assets/google-play.svg";
import appLogo from "../../assets/app-logo.svg";

const Hero = () => {
  return (
    <div className="absolute top-0 w-full min-h-screen  bg-hero-img bg-cover bg-left bg-no-repeat">
      <div className="flex justify-center items-center min-h-screen">
        <div className="container mx-auto flex flex-col-reverse items-center py-36 px-4 sm:flex-row sm:justify-between sm:px-6 md:w-[90%] lg:w-[80%] lg:px-8">
          <div className=" w-full sm:w-1/3 lg:w-1/4 text-center sm:text-left">
            <p className="text-white pb-6 text-xs sm:text-sm lg:text-lg xl:text-2xl">
              <span className="font-nokia-bold text-lg sm:text-xl">“</span>{" "}
              <span className="font-nokia-light">
                ዕዝራም የእግዚአብሔርን ሕግ{" "}
                <span className="text-accent-5 font-nokia-bold">
                  ይፈልግና ያደርግ ዘንድ፥
                </span>{" "}
                ለእስራኤልም ሥርዓትንና ፍርድን{" "}
                <span className="text-accent-5 text-highlight font-nokia-bold">ያስተምር ዘንድ</span>{" "}
                ልቡን አዘጋጅቶ ነበር።
              </span>
              <span className="font-nokia-bold text-lg sm:text-xl"> ”</span>{" "}
              <span className="text-accent-5 font-nokia-bold">ዕዝራ 7:10</span>
            </p>
          </div>
          <div className="w-full text-center pb-8 sm:w-2/3 md:text-right lg:pb-1 xl:pb-2">
            <p className="text-xl font-nokia-bold text-white lg:text-2xl xl:text-3xl">
              መጽሃፍ ቅዱስ ጥናት በስልክዎት
            </p>
            <h1 className="font-Lato-Black text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
              Study The <br className="hidden md:block" /> Bible On <br />
              <span className="text-accent-5 text-highlight">Your Phone</span>
            </h1>
            <div className="flex justify-center sm:justify-end items-center pt-2 gap-2 md:gap-3">
              <a href="#">
                <img
                  className="h-6 md:h-8 xl:h-12"
                  src={googlePlay}
                  alt="Google Play Logo"
                />
              </a>
              <a href="#">
                <img
                  className="h-6 md:h-8 xl:h-12"
                  src={appLogo}
                  alt="App Store Logo"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
