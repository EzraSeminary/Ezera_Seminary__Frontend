import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/api-slices/apiSlice";
import { toast } from "react-toastify";
import { ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react";

const ManageUsers: React.FC = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, isError } = useGetUsersQuery(undefined, {});
  const [updateUserMutation] = useUpdateUserMutation();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching users. Please try again.");
    } else if (users && users.length === 0) {
      toast.info("No users found.");
    }
  }, [isError, users]);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        await updateUserMutation(editingUser).unwrap();
        toast.success("User updated successfully!");
        setEditingUser(null);
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
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form>
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
                  value={editingUser.password}
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
