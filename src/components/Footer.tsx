const Footer = () => {
  return (
    <div className="flex flex-col mx-auto">
      <div className="flex flex-col bg-secondary-6 justify-center items-center py-8 space-y-4">
        <div className="flex flex-row justify-center items-center space-x-3">
          <div>
            <img src="../assets/ezra-logo.svg" alt="" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#fff] ">
              <strong className="text-2xl">Ezra</strong> Seminary
            </h1>
            <p className="text-accent-5 text-base font-nokia-light">
              Spreading the Gospel
            </p>
          </div>
        </div>
        <div className="flex flex-row space-x-6 text-white">
          <div className="flex flex-row space-x-2 justify-center items-center">
            <div>
              <img src="../assets/message-icon.svg" alt="" />
            </div>
            <p className="font-nokia-light">ezraseminary@gmail.com</p>
          </div>
          <div className="flex flex-row space-x-2 justify-center items-center">
            <div>
              <img src="../assets/phone-icon.svg" alt="" />
            </div>
            <p className="font-nokia-light">+251 911 12 13 14</p>
          </div>
        </div>
      </div>
      <div className=" bg-[#293239] w-[100%]">
        <div className="flex flex-col justify-center items-center py-6 space-y-6 md:flex-row md:justify-between md:w-[80%] mx-auto">
          <p className="font-nokia-light text-[#fff] w-[40%] text-center md:w-[25%] md:text-left">
            Copyright 2024 @ YetinbitKal Ministry Website by{" "}
            <span className="text-accent-5  font-nokia-bold"> AmenDevs </span>
          </p>
          <ul className="flex flex-row justify-center items-center space-x-4 ">
            <a href="">
              <li className="">
                <img src="../assets/instagram-logo.svg" alt="" />
              </li>
            </a>
            <a href="">
              <li className="">
                <img src="../assets/facebook-logo.svg" alt="" />
              </li>
            </a>
            <a href="">
              <li className="">
                <img src="../assets/telegram-logo.svg" alt="" />
              </li>
            </a>
            <a href="">
              <li className="">
                <img src="../assets/YouTube-logo.svg" alt="" />
              </li>
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
