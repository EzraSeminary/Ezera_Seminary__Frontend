import "./LoadingAnimation.css"; // Make sure to create this CSS file

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="loading-animation">
        {/* You can add your custom animated elements here */}
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
