// Yet to be fixed ❗❗❗
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-100 container mx-auto p-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-4">My Profile</h1>

        {/* User Avatar and Email */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="/assets/avatar.JPG" // Will be Replaced with the actual avatar URL from the backend later
            alt="User Avatar"
            className="rounded-full w-24 h-24"
          />
          <span className="text-lg font-medium mt-2">{user?.email}</span>
        </div>

        <div className="space-y-5 flex flex-col items-center p-5 bg-primary-3 rounded-lg shadow-md divide-y divide-primary-7">
          {/* User Info */}
          <div className="flex items-start space-x-2 mb-4 py-2">
            <div className="font-bold text-lg text-accent-6">Name:</div>
            <div className="text-lg">{user.firstName}</div>
          </div>

          {/* Achievements */}
          <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110">
            <a href="#achievements">Achievements</a>
          </h2>

          {/* Leaderboards */}
          <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110">
            <a href="#leaderboards">Leaderboards</a>
          </h2>

          {/* Certificates */}
          <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110">
            <a href="#certificates">Certificates</a>
          </h2>

          {/* Practical Assessment Results */}
          <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110">
            <a href="#practical-assessment-results">
              Practical Assessment Results
            </a>
          </h2>

          {/* My Performance */}
          <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110">
            <a href="#my-performance">My Performance</a>
          </h2>

          {/* Account Settings */}
          <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110">
            <a href="profile/settings">Account Settings</a>
          </h2>
        </div>

        {/* Footer Links */}
        <footer className="mt-6 flex justify-center items-center">
          <a href="/terms" className="text-accent-6 hover:underline">
            Terms and Conditions and Privacy Policy
          </a>
          <button
            onClick={() => {
              // Handle contact support action
              console.log("Contact support clicked");
            }}
            className="ml-4 bg-accent-6 text-white px-3 py-1 rounded hover:bg-accent-4 hover:text-accent-7"
          >
            Contact support
          </button>
          <button
            onClick={
              // Handle sign out action
              handleLogout
            }
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Sign out
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserProfile;
