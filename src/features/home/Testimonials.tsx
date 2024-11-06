import { motion } from "framer-motion";
import eden from "../../assets/eden.jpeg";
import mule from "../../assets/mule.png";
import yabi from "../../assets/yabi.jpeg";

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
                src={eden}
                alt="Eden Teshome"
              />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <motion.h2
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl"
              >
                ኤደን ተሾመ
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="text-secondary-4 font-nokia-Regular text-sm xl:text-lg mb-4 px-8"
              >
                “የዕዝራ ሴሚናሪ ኮርስ ብቻ አልነበረም፣ ጉዞም ነበር። የእዝራ ሴሚናሪ ለእኔ ለውጥ የሚያመጣ ልምድ ሆኖልኛል።
                ትምህርቶቹ መጽሐፍ ቅዱስን በጥልቀት እንድመረምር ረድቶኛል። እምነቴ በከፍተኛ ደረጃ አድጓል፣
                እናም ከእግዚአብሔር ጋር እንዴት እንደምገናኝ እና በህይወቴ ውስጥ ትርጉም እንዳገኝ አስተምሮኛል።”
              </motion.p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="flex flex-col w-full mt-3">
            <div className="mx-auto w-[40%]">
              <img
                className="rounded-full border p-1 border-accent-6"
                src={mule}
                alt="Mulat Woret"
              />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <motion.h2
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl"
              >
                ሙላት ወረት
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="text-secondary-4 font-nokia-Regular text-sm xl:text-lg mb-4 px-8"
              >
                "ዕዝራ ሴሚናሪ በመንፈስ ቅዱስ ምሪት እንዴት የእግዚአብሔር ቅዱስ ቃል መጽሐፍ ቅዱስን ማጥናትና የመለኮትን ፍጹም ፈቃድ ይበልጥ በቃሉ 
                ውስጥ በቀላሉ መረዳት እንደሚቻል መንገድን አሳይቶኛል። ስለዚህ ሴሚናሪ የእግዚአብሔርን ስም እባርካለሁ!!!"
              </motion.p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="flex flex-col w-full mt-3">
            <div className="mx-auto w-[40%]">
              <img
                className="rounded-full border p-1 border-accent-6"
                src={yabi}
                alt="Yeabsira Wubnew"
              />
            </div>
            <div className="text-center py-4 font-nokia-bold">
              <motion.h2
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="text-accent-5 pb-2 text-lg lg:text-xl xl:text-2xl"
              >
                የአብስራ ውብነው
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="text-secondary-4 font-nokia-Regular text-sm xl:text-lg mb-4 px-8"
              >
               ዕዝራ ሴሚናሪ የእግዚአብሔርን ሕግ ለማጥናትና ለማድረግ፣ ሥርዐቱንና ሕጉን ለማስተማር ራሴን ለመስጠት
                የረዳኝ ሴሚናሪ ከመሆኑ በተጨማሪ በዚህ ትውልድ መካከል የመንግስቱን መልእክት ለማዳረስ እና ብዙዋች በቃሉ
                ላይ እንዲመሰረቱ ለማድረግ የሚሰራ ሴሚናሪ በመሆኑ እግዚአብሔርን ስለዚህ አገልግሎት አመሰግነዋለሁ።
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
