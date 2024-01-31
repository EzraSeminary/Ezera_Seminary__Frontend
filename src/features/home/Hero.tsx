import googlePlay from "../../assets/google-play.svg";
import appLogo from "../../assets/app-logo.svg";

const Hero = () => {
  return (
    <div className="absolute top-0 w-full h-auto mx-auto bg-hero-img bg-cover bg-left bg-no-repeat">
      <div className="flex justify-center items-center">
        <div className="flex flex-col-reverse justify-between h-auto w-[80%] pt-36 md:flex-row md:items-center md:mx-auto md:py-40 lg:pt-48  lg:pb-40 lg:max-w-full xl:pt-44  ">
          <div className=" w-[75.5%] md:w-[35%] md:self-center lg:w-[32%] xl:w-[35%]">
            <p className="font-nokia-bold text-white pb-6 text-xs md:text-sm lg:text-lg xl:text-2xl ">
              <span className="font-bold text-lg md:text-xl">“</span>{" "}
              <span className="font-nokia-light">
                ዕዝራም የእግዚአብሔርን ሕግ{" "}
                <span className="text-accent-5 font-nokia-bold">
                  ይፈልግና ያደርግ ዘንድ፥
                </span>{" "}
                ለእስራኤልም ሥርዓትንና ፍርድን{" "}
                <span className="text-accent-5 font-nokia-bold">ያስተምር ዘንድ</span>{" "}
                ልቡን አዘጋጅቶ ነበር።
              </span>
              <span className="font-bold text-lg md:text-xl"> ”</span>{" "}
              <span className="text-accent-5 font-nokia-bold">ዕዝራ 7:10</span>
            </p>
          </div>
          <div className="w-full pb-8 space-y-2 md:w-[60%]md:text-right md:pb-0 lg:pb-1 xl:pb-2  ">
            <p className="text-xl ont-nokia-bold text-white lg:text-2xl xl:text-3xl f">
              መጽሃፍ ቅዱስ ጥናት በስልክዎት
            </p>
            <h1 className="font-Lato-Black text-white text-3xl leading-9 md:text-4xl md:leading-tight lg:text-4xl xl:text-6xl ">
              Study The <br /> Bible On <br />
              <span className="text-accent-5">Your Phone</span>
            </h1>
            <div className="flex justify-start items-center space-x-4 pt-2 md:justify-end  ">
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
