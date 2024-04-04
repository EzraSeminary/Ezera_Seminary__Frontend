import { motion } from "framer-motion";
import melak from "../../assets/melak.svg";
import janet from "../../assets/janet.svg";
import dawit from "../../assets/dawit.webp";

const Testimonials = () => {
  return (
    <div className="my-12">
      {/* Testimonials section */}
      <div className="flex-1 container mx-auto px-4 space-y-4">
        {/* Title of the page */}
        <h1 className="text-3xl font-nokia-bold  text-secondary-6 text-center ">
          Testimonials
        </h1>
        <hr className="border-accent-5 border-1 w-[90%] pb-3 mx-auto" />

        {/*Container for the Testimonials contents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6 w-[90%] mx-auto">
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
              <motion.h2
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl"
              >
                ፓ/ር መልዓክ አለማየሁ (ዶ/ር)
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="text-secondary-4 font-nokia-Regular text-sm xl:text-lg mb-4 px-8"
              >
                “መጽሃፍ ቅዱስን ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።መጽሃፍ ቅዱስን
                ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።”
              </motion.p>
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
              <motion.h2
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl"
              >
                ውብገነት ቦጋለ (ጃኔት)
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="text-secondary-4 font-nokia-Regular text-sm xl:text-lg mb-4 px-8"
              >
                “መጽሃፍ ቅዱስን ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።መጽሃፍ ቅዱስን
                ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።”
              </motion.p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="flex flex-col w-full mt-3">
            <div className="mx-auto w-[40%]">
              <img
                className="rounded-full border p-1 border-accent-6"
                src={dawit}
                alt="dawit"
              />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <motion.h2
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl"
              >
                ዳዊት መሃሪ
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="text-secondary-4 font-nokia-Regular text-sm xl:text-lg mb-4 px-8"
              >
                “መጽሃፍ ቅዱስን ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።መጽሃፍ ቅዱስን
                ማንበብ ከምንም በላይ ለህይወታችን አስፈላጊው እና ዋነኛው ነገር ነው።”
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
