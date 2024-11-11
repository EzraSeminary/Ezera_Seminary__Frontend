import melak from "../../assets/img 4.webp";
import janet from "../../assets/img 2.webp";
import dawit from "../../assets/img 3.webp";

const OurTeam = () => {
  return (
    <div className="">
      {/* Testimonials section */}
      <div className="flex-1 container mx-auto px-4 space-y-0 mb-3">
        {/* Title of the page */}
        <h1 className="text-3xl font-nokia-bold  text-secondary-6 text-center pb-2">
          ሦስቱ የሴሚናሪው ዋና ዘርፎች
        </h1>
        <hr className="border-accent-5  w-[5%] pb-8 mx-auto " />

        {/*Container for the Testimonials contents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6  lg:gap-6">
          {/* Testimonial 1 */}
          <div className="flex flex-col w-full mt-3">
            <div className="mx-auto  w-[40%] ">
              <img
                className="rounded-full border p-1 border-accent-6"
                src={melak}
                alt="melak"
              />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <h2 className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl">
                ዕለታዊ የጥሞና ንባቦች
              </h2>
              <p className="text-secondary-6 font-nokia-Regular text-sm xl:text-lg mb-4 w-[90%] mx-auto">
                በየእለቱ ከቅዱስ ቃሉ አጠር ያሉ የጥሞና ንባቦች የሚቀርቡበት፣ የእግዚአብሔርን ድምጽ ለሕይወታችን
                በጸሎት ሆነን ለመስማት የሚያስችለን ነው።
              </p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="flex flex-col w-full mt-3">
            <div className="mx-auto w-[40%]">
              <img
                className="rounded-full border p-1 border-accent-6"
                src={janet}
                alt="janet"
              />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <h2 className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl">
                 ኮርሶች
              </h2>
              <p className="text-secondary-6 font-nokia-Regular text-sm xl:text-lg mb-4 w-[90%] mx-auto">
                በተለያዩ መጽሐፍ ቅዱሳዊ ርእሶች ጠለቅ ያለ ጥናት ለማድረግ የሚያስችል ነው።
              </p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="flex flex-col w-full mt-3 ">
            <div className="mx-auto w-[40%]">
              <img
                className="rounded-full border p-1 border-accent-6"
                src={dawit}
                alt="dawit"
              />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <h2 className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl">
                ሳምንታዊ የመጽሐፍ ቅዱስ ጥናቶች
              </h2>
              <p className="text-secondary-6 font-nokia-Regular text-sm xl:text-lg mb-4 w-[90%] mx-auto">
                በአንድ መሪ ርእስ ላይ ለሦስት ወራት ጥናት ለማድረግ የሚያስችል፣ እለታዊ ንባብና ሳምንታዊ
                ትምህርትንም አጣምሮ የያዘ ነው።
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
