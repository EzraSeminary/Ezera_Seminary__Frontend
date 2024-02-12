const ContactUs = () => {
  return (
    <div className="relative h-screen">
      <div
        className="bg-coming-soon bg-cover h-full"
        style={{ backgroundImage: `url('../assets/home-page-img.svg')` }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
        <div className="relative z-10 text-primary-1 align-middle font-bold text-7xl text-center">
          <div>Contact us</div>
          <div className="text-3xl">Coming Soon</div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
