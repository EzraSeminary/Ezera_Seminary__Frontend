import melak from "../../assets/melak.svg";
import janet from "../../assets/janet.svg";
import dawit from "../../assets/dawit.webp";

const Testimonials = () => {
  return (
    <div className="">
      <div className="flex-1 border-2 border-yellow-800 flex flex-col items-center justify-center space-y-4 w-[100%] mx-auto">
        <h1 className="text-3xl font-nokia-bold  text-secondary-6">
          Testimonials
        </h1>
        <hr className="border-accent-5 border-1 w-[100%] pb-3" />
        <div className="flex flex-col w-[80%] justify-center items-center  mx-auto space-y-6 md:flex-row md:space-x-4 md:space-y-0 ">
          <div className="flex  flex-col w-[33.%] md:w-[33.3%] mt-6">
            <div className="mx-auto w-[33.%]">
              <img className="rounded-full" src={melak} alt="melak" />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <h2 className="text-accent-5 text-2xl pb-2">
                ፓ/ር መልዓክ አለማየሁ (ዶ/ር)
              </h2>
              <p className="text-secondary-6 font-nokia-light text-lg mb-4">
                “መጽሃፍ ቅዱስን ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።መጽሃፍ ቅዱስን
                ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።”
              </p>
            </div>
          </div>
          <div className="flex  flex-col w-[33.%] md:w-[33.3%]">
            <div className="mx-auto w-[33.%]">
              <img className="rounded-full" src={janet} alt="janet" />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <h2 className="text-accent-5 text-2xl pb-2">ውብገነት ቦጋለ (ጃኔት)</h2>
              <p className="text-secondary-6 font-nokia-light text-lg mb-4">
                “መጽሃፍ ቅዱስን ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።መጽሃፍ ቅዱስን
                ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።”
              </p>
            </div>
          </div>
          <div className="flex  flex-col w-[33.%] md:w-[33.3%]">
            <div className="mx-auto w-[33.%]">
              <img className="rounded-full" src={dawit} alt="dawit" />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <h2 className="text-accent-5 text-2xl pb-2">ዳዊት መሃሪ</h2>
              <p className="text-secondary-6 font-nokia-light text-lg mb-4">
                “መጽሃፍ ቅዱስን ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።መጽሃፍ ቅዱስን
                ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
