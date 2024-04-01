import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/api-slices/apiSlice";
import { toast } from "react-toastify";
import { ArrowLeft, Eye, EyeSlash, XCircle } from "@phosphor-icons/react";
// import mehari from "@/assets/avatar.png"; //use default image mehari for blank avatar image for now

const ManageUsers: React.FC = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, isError } = useGetUsersQuery(undefined, {});
  const [updateUserMutation] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation(userId).unwrap();
      toast.success("User deleted successfully!");
      // Refetch the user list to update the UI
      await refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user. Please try again.");
    }
  };
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching users. Please try again.");
    } else if (users && users.length === 0) {
      toast.info("No users found.");
    }
  }, [isError, users]);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setSelectedAvatar(null);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        const formData = new FormData();
        formData.append("firstName", editingUser.firstName);
        formData.append("lastName", editingUser.lastName);
        formData.append("email", editingUser.email);
        formData.append("role", editingUser.role);
        if (selectedAvatar) {
          formData.append("avatar", selectedAvatar);
        }
        if (editingUser.password) {
          formData.append("password", editingUser.password);
        }
        await updateUserMutation({
          id: editingUser._id,
          updatedUser: formData,
        }).unwrap();
        toast.success("User updated successfully!");
        setEditingUser(null);
        setSelectedAvatar(null);
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Error updating user. Please try again.");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Implement user deletion logic here
    console.log("Deleting user:", userId);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={goBack}
        className="mb-4 bg-accent-6 hover:bg-accent-7 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
      >
        <ArrowLeft size={25} />
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Avatar</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr
              key={user._id}
              className={`border-b ${
                editingUser?._id === user._id ? "bg-gray-100" : ""
              }`}
            >
              <td className="px-4 py-2">
                <img
                  src={`https://ezra-seminary.mybese.tech/images/${user.avatar}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full"
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
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py -1 px-2 rounded focus:outline-none focus:shadow-outline"
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
                      onClick={() => handleDeleteUser(user._id)}
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-500 hover:text-gray-700"
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
                      : `https://ezra-seminary.mybese.tech/images/${editingUser.avatar}`
                  }
                  alt={`${editingUser.firstName} ${editingUser.lastName}`}
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <label htmlFor="avatar" className="block font-medium mb-1">
                    Avatar
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedAvatar(e.target.files[0]);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="firstName" className="block font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={editingUser.firstName}
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
                <label htmlFor="lastName" className="block font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={editingUser.lastName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, lastName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block font-medium mb-1">
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
              <div className="mb-4">
                <label htmlFor="role" className="block font-medium mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6"
                >
                  <option value="Learner">Learner</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  className="bg-accent-6 hover:bg-accent-7 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
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
