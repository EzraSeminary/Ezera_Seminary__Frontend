import aimImage from "@/assets/aim-img-1.jpg";
import visionImage from "@/assets/vision-img-1.jpg";

const Purpose = () => {
  return (
    <div className="space-y-12   w-full">
      <div className="space-y-2 w-full">
        {/* Title of the page */}
        <h1 className="text-3xl font-nokia-bold  text-secondary-6 text-center">
          Who We Are
        </h1>
        <hr className="border-accent-5  w-[5%]  mx-auto pb-2" />
        <p className="w-[75%] mx-auto text-justify">
          “የትንቢት ቃል የወንጌል አገልግሎት” በጀርመን አገር በሚገኙ አድቬንቲስት ወንድሞች እ.ኤ.አ. በ1999 ዓ.ም.
          ተመስርቶ የተለያዩ መንፈሳዊ አገልግሎቶችን በመስጠት ላይ ይገኛል፡፡ “የትንቢት ቃል የወንጌል አገልግሎት”
          የኢትዮጵያ አድቬንቲስት ቤተ ክርስቲያን ወንጌልን እንድታሰራጭ ከጌታ የተሰጣትን ተልዕኮ እንድትወጣ የሚደግፍ፣
          በፈቃደኛ አገልጋዮች የተቋቋመ አገልግሎት ሲሆን፣ ራዕዩ፡- የእግዚአብሔር ቅሬታ ሕዝብ በእውነተኛ የደቀመዝሙርነት
          ጎዳና እየተጓዘ የየሱስ ዳግም ምጻትን ሲያፋጥን ማየት፣ ተልዕኮው ደግሞ:- በጽሑፍ፣ በድምጽ፣ በምስል፣ በፊልም፣
          በድረገጽ፣ በፌስቡክ፣ በዩትዩብ፣ በሬዲዮ እና በቴሌግራም እንዲሁም በጸሎት አገልግሎት፤ ለክርስቶስ ኢየሱስ ዳግም
          ምጻት የሚያዘጋጁ መንፈሳዊ መልዕክቶችን በሃገር ውስጥም ሆነ ከሃገር ውጪ ለሚገኙት ኢትዮጵያውያን ወገኖች
          ማስተላለፍ ነው፡፡
        </p>
        <hr className="border-accent-5  w-[5%]  mx-auto pb-2" />
        <p className="w-[75%] mx-auto text-justify">
          “Yetnbit Kal Ministries” (Engl. Prophetic Word Ministries) Was
          Established By Ethiopian Brothers Living In Germany In The Year 1998
          To Support The Seventh-Day Adventist Church’s Mission Of Proclaiming
          The Three Angels Message To The World Through Publication In Amharic
          And Other Ethiopian Languages. It Has Published And Disseminated The
          Gospel Of Our Lord Jesus Christ In Newsletters, Magazines, Books,
          Audio Visuals And The Internet.
        </p>
      </div>

      <div className="flex flex-col w-[80%] mx-auto justify-center space-y-6 lg:space-y-16">
        {/* Aim */}
        <div className="flex flex-col lg:flex-row justify-center w-[90%] mx-auto space-y-6 lg:space-y-0 lg:gap-16 ">
          <div className="font-nokia-regular lg:w-1/2 text-secondary-6 space-y-3">
            <h2 className="text-3xl font-nokia-bold ">ራዕይ</h2>
            <hr className="border-accent-5" />
            <p className="text-justify">
              “የትንቢት ቃል የወንጌል አገልግሎት” የኢትዮጵያ ሰባተኛ ቀን አድቬንቲስት ቤተ ክርስቲያን ወንጌልን
              በመላው አለም እንድታሰራጭ፣ በዮሐንስ ራእይ ምዕራፍ 14:6-12 ላይ ከጌታ የተሰጣትን ተልዕኮ እንድትወጣ
              የሚደግፍ፣ በፈቃደኛ አገልጋዮች የተቋቋመ አገልግሎት ሲሆን፣ ራዕዩ፡- የእግዚአብሔር ሕዝብ በእውነተኛ
              የደቀመዝሙርነት ጎዳና እየተጓዘ የኢየሱስ ክርስቶስ ዳግም ምጻትን ሲያፋጥን ማየት ነው።
            </p>
          </div>
          <div className="lg:w-1/2 ">
            <img src={aimImage} alt="" className="rounded-lg" />
          </div>
        </div>
        {/* Vision */}
        <div className="flex flex-col lg:flex-row-reverse justify-center w-[90%] mx-auto space-y-6 lg:space-y-0 lg:gap-12 ">
          <div className="font-nokia-regular lg:w-1/2 text-secondary-6 space-y-3">
            <h2 className="text-3xl font-nokia-bold ">ተልዕኮ</h2>
            <hr className="border-accent-5" />
            <p className="text-justify">
              በጽሑፍ፣ በድምጽ፣ በምስል፣ በፊልም፣ በድረገጽ፣ በፌስቡክ፣ በዩትዩብ፣ በሬዲዮ እና በቴሌግራም እንዲሁም
              በጸሎት አገልግሎት፤ ለክርስቶስ ኢየሱስ ዳግም ምጻት የሚያዘጋጁ መንፈሳዊ መልእክቶችን በሃገር ውስጥም ሆነ
              ከሃገር ውጪ ለሚገኙት ኢትዮጵያውያን ወገኖች ማስተላለፍ ነው፡፡
            </p>
          </div>
          <div className="lg:w-1/2 ">
            <img src={visionImage} alt="" className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purpose;
