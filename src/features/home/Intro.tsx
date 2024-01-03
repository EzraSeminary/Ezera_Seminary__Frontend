const Intro = () => {
  return (
    <div className="md:flex md:flex-col w-[80%] mx-auto md:justify-center md:items-center">
      <div className="flex flex-col md:flex-row-reverse">
        <div className="flex flex-col space-y-6 text-secondary-6 justify-center items-center mx-auto text-center md:w-[50%]">
          <h2 className="text-2xl md:text-4xl font-nokia-bold w-[40%] md:w-[65%]">
            የእግዚአብሔር ቃል <span className="text-accent-5">የሕይወት እንጀራ</span> ነው!
          </h2>
          <hr className="border-accent-5 border-1 w-[100%] md:w-[80%]" />
          <p className="font-nokia-light w-[78%] text-lg md:w-[64%]">
            “ልጄ ሆይ፥{" "}
            <span className="text-accent-5 font-nokia-bold">ቃሌን ጠብቅ</span>{" "}
            ትእዛዜንም በአንተ ዘንድ ሸሽግ። ትእዛዜን ጠብቅ{" "}
            <span className="font-nokia-bold text-[]"> በሕይወትም ትኖራለህ፤ </span>{" "}
            ሕጌንም{" "}
            <span className="font-nokia-bold text-[]"> እንደ ዓይንህ ብሌን ጠብቅ፤</span>{" "}
            በጣቶችህ እሰራቸው፤ በልብህ ጽላት ጻፋቸው።” ምሳሌ 7:1-3
          </p>
        </div>
        <div className="mx-auto w-[100%] cursor-pointer mt-12  md:w-[50%]">
          <img
            className="w-full"
            src="../assets/Intro-Video.svg"
            alt="Introduction Video"
          />
        </div>
      </div>
      <div className="hidden md:flex text-center mt-12 ">
        <p className=" font-nokia-light text-xl text-secondary-6">
          በየዕለቱ <span className="font-nokia-bold"> መጽሃፍ ቅዱስን ለማጥናት </span> ይህንን
          መተግበሪያ <span className="font-nokia-bold text-[]"> በስልክዎት ላይ </span>{" "}
          ይጫኑ እና ይጠቀሙ።
        </p>
      </div>
    </div>
  );
};

export default Intro;
