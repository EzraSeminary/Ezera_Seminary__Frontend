// src/redux/api-slices/apiSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Course } from "@/types/courseTypes";
import { Devotion, PaginatedDevotionsResponse } from "@/types/devotionTypes";

interface PaginatedCoursesResponse {
  data: Course[];
  total: number;
  page: number;
  limit: number;
}

interface AnalyticsData {
  newUsers: number;
  totalUsers: number;
  newCourses: number;
  totalCourses: number;
  accountsReached: number;
  usersLeft: number;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://ezrabackend.online",
    // Uncomment the following line if testing locally
    baseUrl: "http://localhost:5100",
    prepareHeaders: (headers) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user ? user.token : "";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Devotions", "Courses"],
  endpoints: (builder) => ({
    // Auth Endpoints
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
    forgotPassword: builder.mutation({
      query: (email: string) => ({
        url: "/users/forgot-password",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }),
    }),
    resetPassword: builder.mutation({
      query: ({
        token,
        newPassword,
      }: {
        token: string;
        newPassword: string;
      }) => ({
        url: `/users/reset-password/${token}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      }),
    }),
    sendMessage: builder.mutation({
      query: ({
        firstName,
        lastName,
        email,
        message,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        message: string;
      }) => ({
        url: "/users/contact",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, message }),
      }),
    }),
    signup: builder.mutation({
      query: ({
        firstName,
        lastName,
        email,
        password,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }) => ({
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

    // User Endpoints
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
      query: (id: string) => `/users/get/${id}`,
    }),
    getCurrentUser: builder.query({
      query: () => "/users/current",
    }),
    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),

    // Course Endpoints with Pagination
    getCourses: builder.query<
      PaginatedCoursesResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/course/getall?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Courses" as const,
                id: _id,
              })),
              { type: "Courses", id: "LIST" },
            ]
          : [{ type: "Courses", id: "LIST" }],
    }),
    getCourseById: builder.query<Course, string>({
      query: (id: string) => `/course/get/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Courses", id }],
    }),

    // Devotion Endpoints with Pagination
    getDevotions: builder.query<
      PaginatedDevotionsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/devotion/show?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Devotions" as const,
                id: _id,
              })),
              { type: "Devotions", id: "LIST" },
            ]
          : [{ type: "Devotions", id: "LIST" }],
    }),

    // New: Get Today's Devotion
    getTodayDevotion: builder.query<Devotion, void>({
      query: () => `/devotion/today`,
      providesTags: (result) =>
        result ? [{ type: "Devotions", id: result._id }] : [],
    }),

    // New: Get Devotions by Month
    getDevotionsByMonth: builder.query<Devotion[], string>({
      query: (month) => `/devotion/show?month=${encodeURIComponent(month)}`,
      transformResponse: (response: PaginatedDevotionsResponse) =>
        response.data,
      providesTags: (result, error, month) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Devotions" as const,
                id: _id,
              })),
              { type: "Devotions", id: `MONTH-${month}` },
            ]
          : [{ type: "Devotions", id: `MONTH-${month}` }],
    }),
    createDevotion: builder.mutation<void, FormData>({
      query: (newDevotion) => {
        const formData = new FormData();
        Object.entries(newDevotion).forEach(([key, value]) => {
          formData.append(key, value as string | Blob);
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
          formData.append(key, value as string | Blob);
        });

        return {
          url: `/devotion/${id}`,
          method: "PUT",
          body: formData, // use FormData instead of JSON
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Devotions", id }],
    }),
    deleteDevotion: builder.mutation({
      query: (id: string) => ({
        url: `/devotion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Devotions", id },
        { type: "Devotions", id: "LIST" },
      ],
    }),

    // Analytics Endpoint
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => "/analytics",
    }),
  }),
});

export const {
  useSignupMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetDevotionsQuery,
  useGetTodayDevotionQuery,
  useGetDevotionsByMonthQuery,
  useCreateDevotionMutation,
  useUpdateDevotionMutation,
  useDeleteDevotionMutation,
  useGetCurrentUserQuery,
  useSendMessageMutation,
  useGetAnalyticsQuery,
} = apiSlice;
