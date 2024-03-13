import { useState, useEffect, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserMutation } from "@/redux/api-slices/apiSlice";
import { updateUser } from "@/redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "@/redux/store";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  // Fetch the current user details (assuming the useGetUserQuery hook is available)
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Local state for form fields initialized with current user details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [updateUserMutation] = useUpdateUserMutation();
  const [selectedFile, setSelectedFile] = useState(null);

  // Effect to set the form fields with current user details when they are available
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setEmail(currentUser.email || "");
      setPassword(currentUser.password || "");
    }
  }, [currentUser]);

  const handleAvatarUpload = (event: { target: { files: SetStateAction<null>[]; }; }) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Add a type guard to ensure currentUser is not undefined
    if (currentUser) {
      // Check if there's any change in the form fields
      if (
        firstName !== currentUser.firstName ||
        lastName !== currentUser.lastName ||
        email !== currentUser.email ||
        password !== currentUser.password
      ) {
        updateUserMutation({ firstName, lastName, email, password })
          .unwrap()
          .then((updatedUser) => {
            // Dispatch an action to update the user in the store, if necessary
            dispatch(updateUser(updatedUser));
          });
      }
    }
  };

  return (
    <div className="container mx-10 my-20 p-20 bg-accent-1 rounded-lg shadow-lg">
      <div className="md:flex md:items-start md:space-x-10">
        <div className="md:w-1/3 text-center mb-6 md:mb-0">
          <img
            // src={currentUser.avatar || "default-avatar.png"} // Replace with your default avatar image path
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{`${firstName} ${lastName}`}</h3>
            <label className="mt-2 inline-block bg-accent-6 text-white py-1 px-4 rounded cursor-pointer hover:bg-accent-7">
              <span>Upload New Photo</span>
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              {/* Implement handleAvatarUpload */}
            </label>
          </div>
        </div>
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold text-secondary-10 mb-6">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label className="block text-secondary-10 text-sm font-bold mb-2">
                First Name:
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-secondary-10 text-sm font-bold mb-2">
                Last Name:
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-secondary-10 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-secondary-10 text-sm font-bold mb-2">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline pr-10"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={toggleShowPassword}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-secondary-10 mt-8"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-accent-6 hover:bg-accent-7 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Info
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
