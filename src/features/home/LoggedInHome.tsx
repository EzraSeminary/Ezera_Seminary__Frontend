import { BookOpenText } from "@phosphor-icons/react";

const LoggedInHome = () => {
    return (
        <div className="w-90% p-4">
            <p className="text-2xl font-nokia-bold text-accent-6 border-b border-accent-6 pb-2">Daily Devotionals</p>
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
                  className="text-secondary-6 font-nokia-bold text-lg">
                  የዕለቱ ጥቅስ
                </p>
              </div>
              <button
                className="bg-accent-6 px-4 py-1 rounded-full">
                <p className="text-primary-1 font-nokia-bold text-sm">
                  Open
                </p>
              </button>
            </div>
            <div className="border-b border-accent-6 mt-2 mb-1" />
            <div>
              <p
                className="font-nokia-bold text-lg text-secondary-6">
                ”ስምህ እግዚአብሔር የሆነው አንተ ብቻ፣ በምድር ሁሉ ላይ ልዑል እንደ ሆንህ ይወቁ።“ መዝሙር 83:18
              </p>
            </div>
          </div>
        </div>
    )
}

export default LoggedInHome;