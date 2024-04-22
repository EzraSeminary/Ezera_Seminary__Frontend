import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Devotion } from "@/redux/types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://ezra-seminary.mybese.tech",
    baseUrl: "http://localhost:5100",
    prepareHeaders: (headers) => {
      // Get the user from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user ? user.token : "";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Devotions"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials), // stringified the credentials
      }),
    }),
    sendMessage: builder.mutation({
      query: (formData) => ({
        url: "/users/contact",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),
    signup: builder.mutation({
      query: ({ firstName, lastName, email, password }) => ({
        url: "/users/signup",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      }),
    }),
    createUser: builder.mutation({
      query: (userData) => {
        const formData = new FormData();
        formData.append("firstName", userData.firstName);
        formData.append("lastName", userData.lastName);
        formData.append("email", userData.email);
        formData.append("password", userData.password);
        formData.append("role", userData.role);
        if (userData.avatar) {
          formData.append("avatar", userData.avatar);
        }

        return {
          url: "/users/signup",
          method: "POST",
          body: formData,
        };
      },
    }),

    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Devotions"],
    }),
    updateUser: builder.mutation({
      query: ({ id, updatedUser }) => ({
        url: `/users/profile/${id}`,
        method: "PUT",
        headers: {
          // Don't set the "Content-Type" header, as it will be set automatically by the browser
        },
        body: updatedUser,
      }),
    }),
    getUserById: builder.query({
      query: (id) => `/users/get/${id}`,
    }),
    getCurrentUser: builder.query({
      query: () => "/users/current",
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),
    getCourses: builder.query({
      query: () => "/course/getall",
    }),
    getCourseById: builder.query({
      query: (id) => `/course/get/${id}`,
    }),
    getDevotions: builder.query<Devotion[], void>({
      // Provide types here
      query: () => ({
        url: "/devotion/show",
      }),
      providesTags: ["Devotions"], // Use tagTypes that you have specified
    }),
    createDevotion: builder.mutation<void, FormData>({
      query: (newDevotion) => {
        const formData = new FormData();
        Object.entries(newDevotion).forEach(([key, value]) => {
          formData.append(key, value);
        });
        return {
          url: "/devotion/create",
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData, // use FormData instead of JSON
        };
      },
      invalidatesTags: [{ type: "Devotions", id: "LIST" }],
    }),
    updateDevotion: builder.mutation<
      void,
      { id: string; updatedDevotion: FormData }
    >({
      query: ({ id, updatedDevotion }) => {
        const formData = new FormData();
        Object.entries(updatedDevotion).forEach(([key, value]) => {
          formData.append(key, value);
        });

        return {
          url: `/devotion/${id}`,
          method: "PUT",
          body: formData, // use FormData instead of JSON
        };
      },
    }),
    deleteDevotion: builder.mutation({
      query: (id) => ({
        url: `/devotion/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useLoginMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetDevotionsQuery,
  useCreateDevotionMutation,
  useUpdateDevotionMutation,
  useDeleteDevotionMutation,
  useGetCurrentUserQuery,
  useSendMessageMutation,
} = apiSlice;
