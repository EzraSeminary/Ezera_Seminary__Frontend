import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/api-slices/apiSlice";
import { toast } from "react-toastify";
import { User } from "@/redux/types";
import { ArrowLeft, Eye, EyeSlash, XCircle } from "@phosphor-icons/react";
import { AxiosError } from "axios";
import LoadingPage from "../user/LoadingPage";

const ManageUsers: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useGetUsersQuery(undefined, {});
  const [updateUserMutation] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching users. Please try again.");
    } else if (users && users.length === 0) {
      toast.info("No users found.");
    }
  }, [isError, users]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedAvatar(event.target.files[0]);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setSelectedAvatar(null);
  };

  const handleUpdateUser = async () => {
    try {
      // Check if any of the user details have changed
      const currentUser = users?.find(
        (user: User) => user._id === editingUser?._id
      );
      if (
        currentUser &&
        (currentUser.firstName !== editingUser?.firstName ||
          currentUser.lastName !== editingUser?.lastName ||
          currentUser.email !== editingUser?.email ||
          editingUser?.password ||
          selectedAvatar)
      ) {
        const existingUser = users?.find(
          (user: User) =>
            user.email === editingUser?.email && user._id !== editingUser?._id
        );

        // If the email exists and it's not the same user being edited, throw an error
        if (existingUser) {
          throw new Error("Email already in use");
        }

        const formData = new FormData();
        formData.append("firstName", editingUser?.firstName || "");
        formData.append("lastName", editingUser?.lastName || "");
        formData.append("email", editingUser?.email || "");
        formData.append("role", editingUser?.role || ""); // Add the role field

        // Only add the password field if it's not an empty string
        if (editingUser?.password && editingUser.password.trim() !== "") {
          formData.append("password", editingUser.password);
        }

        if (selectedAvatar) {
          formData.append("avatar", selectedAvatar);
        }
        console.log("Sending the following data to the backend:", {
          id: editingUser?._id,
          updatedUser: Object.fromEntries(formData),
        });
        await updateUserMutation({
          id: editingUser?._id,
          updatedUser: formData,
        }).unwrap();
        toast.success("User updated successfully!");
        setEditingUser(null);
        setSelectedAvatar(null);
        await refetch();
      } else {
        toast.info("No changes made to the user details.");
      }
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data?.message === "E11000 duplicate key error"
      ) {
        toast.error("Email already in use. Please use a different email.");
      } else {
        console.error("Error updating user:", error);
        toast.error("Error updating user. Please try again.");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation(userId).unwrap();
      toast.success("User deleted successfully!");
      await refetch();
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data?.message === "User not found"
      ) {
        toast.error("User not found. Unable to delete.");
      } else {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user. Please try again.");
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-secondary-6 rounded-lg shadow-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-nokia-bold mb-6 text-primary-6">
          Manage Users
        </h2>
        <div
          onClick={goBack}
          className="flex items-center w-max justify-start gap-1 bg-accent-6 hover:bg-accent-7 rounded-full font-nokia-bold mb-4  text-white px-2 py-1 cursor-pointer"
        >
          <button>
            <ArrowLeft size={20} weight="fill" />
          </button>
          <div>Back</div>
        </div>
      </div>
      <table className="w-full table-auto cursor-pointer font-nokia-bold">
        <thead>
          <tr className="bg-secondary-4 text-primary-6 text-xl">
            <th className="px-4 py-2">Avatar</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            ?.filter((user: User) => !user.deletedAt)
            ?.map((user: User) => (
              <tr
                key={user._id}
                className={`border-b ${
                  editingUser?._id === user._id
                    ? "bg-primary-6 "
                    : "text-primary-5 hover:bg-secondary-5 transition-all rounded-lg"
                }`}
              >
                <td className="px-4 py-2">
                  <img
                    src={`https://ezrabackend.online/images/${user.avatar}`}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full  "
                  />
                </td>
                <td className="px-4 py-2">{user.firstName}</td>
                <td className="px-4 py-2">{user.lastName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  {editingUser?._id === user._id ? (
                    <>
                      <button
                        onClick={handleUpdateUser}
                        className="bg-accent-6 hover:bg-accent-7 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-accent-6 hover:bg-accent-7 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id as string)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {editingUser && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-secondary-6 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary-6">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-accent-6 hover:scale-110 transition-all"
              >
                <XCircle size={24} weight="bold" />
              </button>
            </div>
            <form>
              <div className="mb-4 flex items-center">
                <img
                  src={
                    selectedAvatar
                      ? URL.createObjectURL(selectedAvatar)
                      : `https://ezrabackend.online/images/${editingUser.avatar}`
                  }
                  alt={`${editingUser.firstName} ${editingUser.lastName}`}
                  className="w-20 h-20 rounded-full mr-4  border-2 border-accent-6 p-1 "
                />
                <div>
                  <label
                    htmlFor="avatar"
                    className="block font-medium mb-1 text-primary-6 "
                  >
                    Avatar
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    onChange={handleAvatarUpload}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                  />
                </div>
              </div>
              <div className="mb-4 ">
                <label
                  htmlFor="firstName"
                  className="block font-medium mb-1 text-accent-6"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={editingUser.firstName || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="block font-medium mb-1 text-accent-6"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={editingUser.lastName || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, lastName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block font-medium mb-1 text-accent-6"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                />
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block font-medium mb-1 text-accent-6"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={editingUser.password || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 pr-10"
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
              <div className="mb-5">
                <label
                  htmlFor="role"
                  className="block font-medium mb-1 text-accent-6"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={editingUser.role || "Learner"} // Use editingUser.role
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Learner">Learner</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-red-500 hover:bg-red-600 text-primary-6 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  className="bg-accent-6 hover:bg-accent-7 text-primary-6 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
