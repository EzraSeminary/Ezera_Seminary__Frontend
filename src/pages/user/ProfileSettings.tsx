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

  const avatarPreview = selectedFile
    ? URL.createObjectURL(selectedFile)
    : currentUser.avatar || "default-avatar.png";

  // Effect to set the form fields with current user details when they are available
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setEmail(currentUser.email || "");
      setPassword(currentUser.password || "");
    }
  }, [currentUser]);

  const handleAvatarUpload = (event: {
    target: { files: SetStateAction<null>[] };
  }) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (
      currentUser &&
      (firstName !== currentUser.firstName ||
        lastName !== currentUser.lastName ||
        email !== currentUser.email ||
        password ||
        selectedFile) // Also check if a new avatar has been selected
    ) {
      try {
        // Create a FormData instance
        const formData = new FormData();

        // Append the updated user information to the FormData instance
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        if (password) {
          formData.append("password", password);
        }
        if (selectedFile) {
          formData.append("avatar", selectedFile);
        }

        // Call the mutation and pass the FormData instance
        const updatedUser = await updateUserMutation(formData).unwrap();

        // Dispatch an action to update the user in the store
        dispatch(updateUser(updatedUser));
      } catch (error) {
        // Handle the error, perhaps show a message to the user
      }
    }
  };

  return (
    <div className="container mx-10 my-20 p-20 bg-accent-1 rounded-lg shadow-lg">
      <div className="md:flex md:items-start md:space-x-10">
        <div className="md:w-1/3 text-center mb-6 md:mb-0">
          <img
            src={avatarPreview}
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
