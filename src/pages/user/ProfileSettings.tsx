import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/api-slices/apiSlice";
import { updateUser } from "@/redux/authSlice";
import { ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react";
import { RootState } from "@/redux/store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@/redux/types";
import defaultAvatar from "@/assets/avatar.png"; // Import a default avatar image

const ProfileSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: users } = useGetUsersQuery(undefined, {});
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [updateUserMutation] = useUpdateUserMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setEmail(currentUser.email || "");
      setPassword(currentUser.password || "");
      setAvatarPreview(
        currentUser.avatar ? `${currentUser.avatar}` : defaultAvatar
      );
    }
  }, [currentUser]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setAvatarPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const currentUserData = users?.find(
      (user: User) => user.email === currentUser?.email
    );

    if (currentUserData) {
      if (
        firstName !== currentUserData.firstName ||
        lastName !== currentUserData.lastName ||
        email !== currentUserData.email ||
        password ||
        selectedFile
      ) {
        try {
          const formData = new FormData();
          formData.append("firstName", firstName);
          formData.append("lastName", lastName);
          formData.append("email", email);
          if (password) {
            formData.append("password", password);
          }
          if (selectedFile) {
            formData.append("avatar", selectedFile);
          }

          const updatedUser = await updateUserMutation({
            id: currentUserData._id,
            updatedUser: formData,
          }).unwrap();
          toast.success("Profile updated successfully!");
          dispatch(updateUser(updatedUser));
          setFirstName(updatedUser.firstName);
          setLastName(updatedUser.lastName);
          setEmail(updatedUser.email);
          setPassword(updatedUser.password);
          setAvatarPreview(updatedUser.avatar ? `${updatedUser.avatar}` : null);
          setSelectedFile(null);

          // Save the updated user information to local storage
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error: unknown) {
          if (
            typeof error === "object" &&
            error !== null &&
            "status" in error &&
            "data" in error
          ) {
            const apiError = error as {
              status: number;
              data: {
                message: string;
              };
            };
            if (
              apiError.status === 400 &&
              apiError.data.message === "Error uploading avatar"
            ) {
              console.error("Mutation failed:", error);
              toast.error("Failed to upload avatar. Please try again.");
            } else {
              console.error("Mutation failed:", error);
              toast.error("Failed to update profile. Please try again.");
            }
          } else {
            console.error("Mutation failed:", error);
            toast.error("An unknown error occurred. Please try again.");
          }
        }
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-8 my-20 p-10 bg-secondary-6 rounded-lg shadow-lg text-primary-6">
        <button
          onClick={goBack}
          className="mb-4 bg-accent-6 hover:bg-accent-7 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
        >
          <ArrowLeft size={25} />
          Back
        </button>
        <div className="md:flex md:items-start md:space-x-10">
          <div className="md:w-1/3 text-center mb-6 md:mb-0">
            <img
              src={
                avatarPreview
                  ? avatarPreview
                  : currentUser?.avatar
                  ? `${currentUser.avatar}`
                  : defaultAvatar
              }
              alt="User Avatar"
              className="w-[25vmin] rounded-full mx-auto"
            />
            <div className="mt-4">
              <h3 className="text-lg text-primary-6 font-semibold">{`${firstName} ${lastName}`}</h3>
              <label className="mt-2 inline-block bg-accent-6 text-white py-1 px-4 rounded cursor-pointer hover:bg-accent-7">
                <span>Upload New Photo</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
          </div>
          {/* Second Section - Edit Profile Form */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold text-primary-6 mb-6">
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4">
                <label className="block text-primary-6 text-sm font-bold mb-2">
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
                <label className="block text-primary-6 text-sm font-bold mb-2">
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
                <label className="block text-primary-6 text-sm font-bold mb-2">
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
                <label className="block text-primary-6 text-sm font-bold mb-2">
                  Password:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline pr-10"
                />
                <div
                  className="absolute inset-y-0 right-0 pt-8 pr-3 flex items-center cursor-pointer text-accent-8"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeSlash size={18} weight="fill" />
                  ) : (
                    <Eye size={18} weight="fill" />
                  )}
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
    </>
  );
};

export default ProfileSettings;
