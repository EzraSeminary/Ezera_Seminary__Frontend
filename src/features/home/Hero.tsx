const Hero = () => {
  return (
    <div className=" mx-auto home-page-img ">
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col-reverse  md:flex-row justify-between md:items-center w-[80%] md:mx-auto</div>">
          <div className=" w-[80%] md:w-[27%] md:self-center ">
            <p className="text-lg md:text-lg font-nokia-bold text-white">
              <span className="font-bold text-2xl">“</span>{" "}
              <span className="font-nokia-light">
                ዕዝራም የእግዚአብሔርን ሕግ{" "}
                <span className="text-accent-5 font-nokia-bold">
                  ይፈልግና ያደርግ ዘንድ፥
                </span>{" "}
                ለእስራኤልም ሥርዓትንና ፍርድን{" "}
                <span className="text-accent-5 font-nokia-bold">ያስተምር ዘንድ</span>{" "}
                ልቡን አዘጋጅቶ ነበር።
              </span>
              <span className="font-bold text-2xl"> ”</span>{" "}
              <span className="text-accent-5 font-nokia-bold">ዕዝራ 7:10</span>
            </p>
          </div>
          <div className="md:text-right w-[80%] md:w-[60%] pb-8 md:pb-0 space-y-2">
            <p className=" text-xl md:text-2xl font-nokia-bold text-white">
              መጽሃፍ ቅዱስ ጥናት በስልክዎት
            </p>
            <h1 className="text-4xl md:text-7xl font-Lato-Black text-white">
              Study The <br /> Bible On <br />
              <span className="text-accent-5">Your Phone</span>
            </h1>
            <div className="flex justify-start md:justify-end items-center space-x-4 pt-2 md:h-32 ">
              <a href="#">
                <img
                  className="h-6 md:h-12"
                  src="../assets/google-play.svg"
                  alt="Google Play Logo"
                />
              </a>
              <a href="#">
                <img
                  className="h-6 md:h-12"
                  src="../assets/app-logo.svg"
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
