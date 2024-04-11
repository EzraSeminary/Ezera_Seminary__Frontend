import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "@/redux/api-slices/apiSlice";
import { toast } from "react-toastify";
import defaultAvatar from "@/assets/avatar.png"; // Import a default avatar image
import { Eye, EyeSlash } from "@phosphor-icons/react";

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [createUserMutation] = useCreateUserMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Learner");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setAvatarPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUserMutation({
        firstName,
        lastName,
        email,
        password,
        role,
        avatar: selectedFile,
      }).unwrap();
      toast.success("User created successfully!");
      navigate("/admin/users/manage");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user. Please try again.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded-lg shadow-2xl w-[80%] ">
      <h2 className="text-2xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-16 flex flex-col">
        <div className="flex justify-between w-[80%] mx-auto">
          {/* Image container */}
          <div className="mt-6 ">
            {/* <label htmlFor="avatar" className="block font-medium mb-1">
              Avatar
            </label> */}
            <div className="flex flex-col justify-center items-center space-y-3">
              <img
                src={avatarPreview || defaultAvatar}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full mr-4"
              />
              <label
                htmlFor="avatar-input"
                className="bg-accent-6 hover:bg-accent-7 text-white font-medium py-2 px-4 rounded-md cursor-pointer"
              >
                <span>Upload Image</span>
                <input
                  type="file"
                  id="avatar-input"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
          </div>
          {/* name, email, password and role container */}
          <div className="w-[60%] space-y-4 font-nokia-bold text-lg">
            <div>
              <label htmlFor="firstName" className="block font-medium mb-1">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="text-xs w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                required
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-medium mb-1">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="text-xs w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                required
                placeholder="Last Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                required
                placeholder="Email"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block font-medium mb-1">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 pr-10 text-xs"
                required
                placeholder="Password"
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
            <div>
              <label htmlFor="role" className="block font-medium mb-1">
                Role:
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-sm font-Lato-Regular border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 cursor-pointer"
                required
              >
                <option value="Learner">Learner</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
        {/* buttons container */}
        <div className="self-center">
          <button
            type="submit"
            className="bg-accent-6 hover:bg-accent-7 text-white font-medium py-2 px-4 rounded-md"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
