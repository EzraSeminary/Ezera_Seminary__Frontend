import { BookOpenText } from "@phosphor-icons/react";

const LoggedInHome = () => {
    return (
        <div className="w-90% p-4 font-nokia-bold text-secondary-6">
            <p className="text-2xl  text-accent-6 border-b border-accent-6 pb-2">Daily Devotionals</p>
        <div
            className="border-2 border-accent-6 mt-6 rounded-lg bg-primary-2 shadow-lg px-4 py-4">
            <div
              className="flex flex-row w-[100%] justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <BookOpenText
                  size={32}
                  weight="bold"
                  className="text-accent-6"
                  />
                <p
                  className=" font-nokia-bold text-lg">
                  የዕለቱ ጥቅስ
                </p>
              </div>
              <button
                className="bg-accent-6 px-4 py-1 rounded-full">
                <p className="text-primary-1 text-sm">
                  Open
                </p>
              </button>
            </div>
            <div className="border-b border-accent-6 mt-2 mb-1" />
            <div>
              <p
                className="text-lg">
                ”ስምህ እግዚአብሔር የሆነው አንተ ብቻ፣ በምድር ሁሉ ላይ ልዑል እንደ ሆንህ ይወቁ።“ መዝሙር 83:18
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mt-4 border-t border-secondary-3 pt-4">
            <p>Continue Studying</p>
            <button
                className="border border-accent-6 px-4 py-1 rounded-full">
                <p className="text-accent-6 text-sm">
                  All Courses
                </p>
              </button>
          </div>
        </div>
    )
}

export default LoggedInHome;