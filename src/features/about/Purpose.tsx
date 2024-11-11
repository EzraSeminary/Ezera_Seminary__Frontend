import aimImage from "@/assets/aim-img-1.webp";
import visionImage from "@/assets/vision-img-1.webp";


const Purpose = () => {
  return (
    <div className="space-y-12   w-full pb-4">
      <div className="space-y-2 w-full">
        {/* Title of the page */}
        <h1 className="text-3xl font-nokia-bold  text-secondary-6 text-center">
          Who We Are
        </h1>
        <hr className="border-accent-6  w-[5%]   mx-auto pb-2 " />
        <p className="w-[75%] mx-auto text-justify lg:py-4">
          ዕዝራ ሴሚናሪ በትንቢት ቃል የወንጌል አገልግሎት የተመሰረተ ዲጅታል የመጽሐፍ ቅዱስ ትምህርት ቤት ነው። ሴሚናሪ
          የሚለው ቃል “ሴሚናሪዩም” ከሚለው የላቲን ቃል የመጣ ሲሆን ትርጉሙም “የችግኝ ማፍያ” ማለት ነው። በእርግጥም
          ሴሚናሪ የመጽሐፍ ቅዱስ ተማሪዎች እንደ ዘር የሚዘሩበት፣ ስር ሰደው የሚያድጉበትና የአገልግሎት ፍሬ
          የሚያፈሩበትንም ልምምድ የሚያገኙበት ነው። የዕዝራ ሴሚናሪ ዲጅታል የመጽሐፍ ቅዱስ ትምህርት ቤት ራዕይና
          ተልእኮም የዘመኑን የቴክኖሎጂ መሣሪያዎች በመጠቀም ብዙዎች የዚህ ልምምድ ባለቤት እንዲሆኑ ማገዝ ነው።
        </p>
        <hr className="border-accent-6  w-[5%]  mx-auto pb-2" />
        <p className="w-[75%] mx-auto text-justify lg:py-4">
          Ezra Seminary is a digital Bible school founded on the “Yetnbit Kal
          Ministries” (Engl. Prophetic Word Ministries). The word 'Seminary'
          comes from the Latin term 'Seminarium,' which means 'seedbed.' Indeed,
          the seminary is a place where Bible students are nurtured like seeds,
          growing deep roots, and bearing fruit through their service. Ezra
          Seminary's vision and mission are to equip many to become owners of
          this training by utilizing modern technological tools.
        </p>
      </div>

      <div className="flex flex-col w-[80%] mx-auto justify-center space-y-6 lg:space-y-16">
        {/* Aim */}
        <div className="flex flex-col lg:flex-row justify-center lg:items-center w-[90%] mx-auto space-y-6 lg:space-y-0 lg:gap-16 ">
          <div className="font-nokia-regular lg:w-1/2 text-secondary-6 space-y-3">
            <h2 className="text-3xl font-nokia-bold ">ራዕይ</h2>
            <hr className="border-accent-5 space-y-2" />
            <p className="text-justify">
              የዕዝራ ሴሚናሪ ራዕይ የክርስቶስ ኢየሱስ ደቀ መዛሙርት እንደ ዕዝራ የእግዚአብሔርን ቃል ለመመርመር፣
              በቃሉ ለመኖርና ቃሉን ለመመስከር የቆረጡና የተጉ ሆነው ማየት ነው።
            </p>
            <p className="text-justify">
              The vision of Ezra Seminary is to see the disciples of Jesus
              Christ, like Ezra, diligently study, live by, and bear witness to
              the Word of God, becoming refined and strengthened in their faith.
            </p>
          </div>
          <div className="lg:w-1/2 ">
            <img src={aimImage} alt="" className="rounded-lg" />
          </div>
        </div>
        {/* Vision */}
        <div className="flex flex-col lg:flex-row-reverse justify-center items-center w-[90%] mx-auto space-y-6 lg:space-y-0 lg:gap-12 ">
          <div className="font-nokia-regular lg:w-1/2 text-secondary-6 space-y-3">
            <h2 className="text-3xl font-nokia-bold ">ተልዕኮ</h2>
            <hr className="border-accent-5" />
            <p className="text-justify">
              የዕዝራ ሴሚናር ተልእኮ ጌታችን ኢየሱስ ክርስቶስ ““እናንተ በቃሌ ብትኖሩ በእውነት ደቀ መዛሙርቴ ናችሁ”
              (ዮሐ 8፡ 31) ባለው መሰረት በአምላካችን ሕያውና የሕይወት ቃል ለመኖር የሚያስችሉ ትምህርቶችን በድረ
              ገጽና በስልክ መተግብሪያ ማቅረብ ነው።
            </p>
            <p className="text-justify">
              The mission of Ezra Seminary is to offer teachings that empower
              people to live by the living and life-giving Word of God, based on
              the foundation of Jesus Christ’s words: "If you hold to my
              teaching, you are really my disciples" (John 8:31). These
              teachings are made available through both the website and mobile
              applications, ensuring accessibility for all.{" "}
            </p>
          </div>
          <div className="lg:w-1/2 ">
            <img src={visionImage} alt="" className="rounded-lg " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purpose;
