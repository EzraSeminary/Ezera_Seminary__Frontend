import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/api-slices/apiSlice";
import { toast } from "react-toastify";
import { User } from "@/redux/types";
import { ArrowLeft, Eye, EyeSlash, XCircle, PencilSimple, Trash, User as UserIcon, Crown, ChalkboardTeacher, GraduationCap, Calendar } from "@phosphor-icons/react";
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12); // Increased for card layout

  // Filtering, searching, and sorting state
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleUserClick = (user: User) => {
    navigate(`/admin/users/${user._id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (confirmed) {
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
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const goBack = () => {
    navigate(-1);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Crown size={20} className="text-yellow-500" weight="fill" />;
      case "Instructor":
        return <ChalkboardTeacher size={20} className="text-blue-500" weight="fill" />;
      case "Learner":
        return <GraduationCap size={20} className="text-green-500" weight="fill" />;
      default:
        return <UserIcon size={20} className="text-gray-500" weight="fill" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Update the currentUsers calculation to include filtering
  const filteredUsers = users?.filter((user: User) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Pagination logic
  const totalPages = Math.ceil((filteredUsers?.length || 0) / usersPerPage);
  const pageNumbers = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-6 to-secondary-7 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-accent-2">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-nokia-bold text-primary-6 mb-2">
                Manage Users
              </h1>
              <p className="text-secondary-6 text-lg">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-3 border border-accent-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-6 focus:border-transparent bg-white text-primary-6 placeholder-secondary-5"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={20} className="text-secondary-5" />
                </div>
              </div>
              <button
                onClick={goBack}
                className="flex items-center gap-2 bg-accent-6 hover:bg-accent-7 text-white font-nokia-bold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <ArrowLeft size={20} weight="fill" />
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentUsers
            ?.filter((user: User) => !user.deletedAt)
            ?.map((user: User) => (
              <div
                key={user._id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                  editingUser?._id === user._id
                    ? "border-accent-6 shadow-2xl scale-105"
                    : "border-accent-2 hover:border-accent-4"
                }`}
                onClick={() => handleUserClick(user)}
                style={{ cursor: 'pointer' }}
              >
                {/* User Card Header */}
                <div className="p-6 border-b border-accent-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <img
                        src={`${user.avatar}`}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-16 h-16 rounded-full border-4 border-accent-2 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-nokia-bold text-lg text-primary-6 mb-1 truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-secondary-7 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {getRoleIcon(user.role)}
                      <span className="text-xs font-medium text-secondary-6">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badge and Join Date */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {user.status === "active" ? "●" : "○"} {user.status}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-secondary-6 flex-shrink-0">
                      <Calendar size={14} weight="fill" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* User Card Actions */}
                <div className="p-6" onClick={(e) => e.stopPropagation()}>
                  {editingUser?._id === user._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateUser}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 hover:shadow-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 hover:shadow-md"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="flex-1 bg-accent-6 hover:bg-accent-7 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <PencilSimple size={16} weight="fill" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id as string)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <Trash size={16} weight="fill" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-2">
            <div className="flex justify-center">
              <ul className="flex list-none gap-2">
                {pageNumbers.map((number, index) => (
                  <li key={index}>
                    {typeof number === 'string' ? (
                      <span className="px-4 py-2 text-secondary-4 font-medium">...</span>
                    ) : (
                      <button
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 rounded-xl font-nokia-bold transition-all duration-200 ${
                          currentPage === number
                            ? "bg-accent-6 text-white shadow-lg scale-105"
                            : "bg-secondary-5 text-primary-6 hover:bg-accent-2 hover:scale-105"
                        }`}
                      >
                        {number}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary-6">Edit User</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-accent-6 hover:text-accent-7 hover:scale-110 transition-all"
                >
                  <XCircle size={28} weight="bold" />
                </button>
              </div>
              
              <form className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <img
                    src={
                      selectedAvatar
                        ? URL.createObjectURL(selectedAvatar)
                        : `${editingUser.avatar}`
                    }
                    alt={`${editingUser.firstName} ${editingUser.lastName}`}
                    className="w-24 h-24 rounded-full border-4 border-accent-6 p-1 object-cover"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="avatar"
                      className="block font-medium mb-2 text-primary-6"
                    >
                      Avatar
                    </label>
                    <input
                      type="file"
                      id="avatar"
                      onChange={handleAvatarUpload}
                      className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-primary-6"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block font-medium mb-2 text-accent-6">
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
                      className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-primary-6"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block font-medium mb-2 text-accent-6">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={editingUser.lastName || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, lastName: e.target.value })
                      }
                      className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-primary-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block font-medium mb-2 text-accent-6">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={editingUser.email || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-primary-6"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block font-medium mb-2 text-accent-6">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={editingUser.password || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, password: e.target.value })
                    }
                    className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-primary-6 pr-12"
                    placeholder="Leave blank to keep current"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-accent-6 hover:text-accent-7"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <EyeSlash size={20} weight="fill" />
                    ) : (
                      <Eye size={20} weight="fill" />
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block font-medium mb-2 text-accent-6">
                    Role
                  </label>
                  <select
                    id="role"
                    value={editingUser.role || "Learner"}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                    className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-primary-6"
                    required
                  >
                    <option value="Admin">Admin</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Learner">Learner</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateUser}
                    className="flex-1 bg-accent-6 hover:bg-accent-7 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;