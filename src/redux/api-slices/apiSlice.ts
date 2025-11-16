import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Devotion } from "@/redux/types";

interface AnalyticsData {
  newUsers: number;
  totalUsers: number;
  newCourses: number;
  totalCourses: number;
  accountsReached: number;
  usersLeft: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  averageSessionTime: number;
  courseCompletionRate: number;
  userEngagementRate: number;
  totalDevotions: number;
  newDevotions: number;
}

interface PerformanceData {
  topUsers: Array<{
    name: string;
    score: number;
    courses: number;
    rank: number;
  }>;
  topCourses: Array<{
    title: string;
    completion: number;
    students: number;
    rank: number;
  }>;
  weeklyActivity: Array<{
    date: string;
    activeUsers: number;
    percentage: number;
  }>;
  systemMetrics: {
    apiUptime: number;
    databaseHealth: number;
    averageResponseTime: number;
    totalRequests: number;
  };
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_API_BASE_URL || "https://ezrabackend.online",
    prepareHeaders: (headers) => {
      const raw = localStorage.getItem("user");
      let token = "";
      try {
        const user = raw ? JSON.parse(raw) : null;
        token = user?.token || "";
      } catch (_) {
        token = "";
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Devotions", "DevotionPlans"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/users/forgot-password",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/users/reset-password/${token}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      }),
    }),
    sendMessage: builder.mutation({
      query: ({ firstName, lastName, email, message }) => ({
        url: "/users/contact",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, message }),
      }),
    }),
    getContacts: builder.query<Array<{ _id: string; firstName: string; lastName: string; email: string; message: string; createdAt: string; repliedAt?: string }>, void>({
      query: () => "/users/contacts",
    }),
    sendContactReply: builder.mutation<{ message: string }, { id: string; subject: string; message: string }>({
      query: ({ id, subject, message }) => ({
        url: `/users/contacts/${id}/reply`,
        method: "POST",
        body: { subject, message },
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
    getDeletedUsersCount: builder.query<{ deletedUsersCount: number }, void>({
      query: () => "/users/deleted-count",
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
    deactivateUser: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/status/${userId}`,
        method: "PUT",
        body: { status },
      }),
    }),
    activateUser: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/status/${userId}`,
        method: "PUT",
        body: { status },
      }),
    }),
    getCourses: builder.query({
      query: () => "/course/getall",
    }),
    getCourseById: builder.query({
      query: (id) => `/course/get/${id}`,
    }),
    getDevotions: builder.query<Devotion[], void>({
      query: () => ({
        url: "/devotion/show?limit=100&sort=desc",
      }),
      providesTags: ["Devotions"],
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
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Devotions", id: "LIST" }],
    }),
    updateDevotion: builder.mutation<void, { id: string; updatedDevotion: FormData }>({
      query: ({ id, updatedDevotion }) => {
        const formData = new FormData();
        Object.entries(updatedDevotion).forEach(([key, value]) => {
          formData.append(key, value);
        });

        return {
          url: `/devotion/${id}`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    deleteDevotion: builder.mutation({
      query: (id) => ({
        url: `/devotion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Devotions"],
    }),
    getAvailableYears: builder.query<number[], void>({
      query: () => "/devotion/years",
    }),
    getDevotionsByYear: builder.query<Devotion[], number>({
      query: (year) => `/devotion/year/${year}`,
      providesTags: ["Devotions"],
    }),
    createDevotionsForNewYear: builder.mutation<{ message: string }, { sourceYear: number; targetYear: number }>({
      query: ({ sourceYear, targetYear }) => ({
        url: "/devotion/copy-year",
        method: "POST",
        body: { sourceYear, targetYear },
      }),
      invalidatesTags: ["Devotions"],
    }),
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => "/analytics",
    }),
    getPerformanceAnalytics: builder.query<PerformanceData, void>({
      query: () => "/analytics/performance",
    }),
    // Devotion Plans
    getDevotionPlans: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/devotion-plan",
        params: params || {},
      }),
      providesTags: ["DevotionPlans"],
    }),
    getDevotionPlanById: builder.query<any, string>({
      query: (id) => `/devotion-plan/${id}`,
      providesTags: ["DevotionPlans"],
    }),
    createDevotionPlan: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/devotion-plan",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["DevotionPlans"],
    }),
    updateDevotionPlan: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/devotion-plan/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["DevotionPlans"],
    }),
    deleteDevotionPlan: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/devotion-plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DevotionPlans"],
    }),
    startDevotionPlan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/devotion-plan/${id}/start`,
        method: "POST",
      }),
      invalidatesTags: ["DevotionPlans"],
    }),
    recordDevotionPlanProgress: builder.mutation<any, { id: string; devotionId: string }>({
      query: ({ id, devotionId }) => ({
        url: `/devotion-plan/${id}/progress`,
        method: "POST",
        body: { devotionId },
      }),
    }),
    getMyDevotionPlans: builder.query<any, { status?: string } | void>({
      query: (params) => ({
        url: "/devotion-plan/me/my",
        params: params || {},
      }),
      providesTags: ["DevotionPlans"],
    }),
    // Plan-specific devotions (admin)
    getPlanDevotions: builder.query<any, { id: string; page?: number; limit?: number; sort?: string }>({
      query: ({ id, ...params }) => ({
        url: `/devotion-plan/${id}/devotions`,
        params,
      }),
      providesTags: ["DevotionPlans"],
    }),
    createPlanDevotion: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        (Array.from(data.entries()) as [string, any][]).forEach(([k, v]) => {
          formData.append(k, v);
        });
        return {
          url: `/devotion-plan/${id}/devotions`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["DevotionPlans"],
    }),
    updatePlanDevotion: builder.mutation<any, { id: string; devotionId: string; data: FormData }>({
      query: ({ id, devotionId, data }) => {
        const formData = new FormData();
        (Array.from(data.entries()) as [string, any][]).forEach(([k, v]) => {
          formData.append(k, v);
        });
        return {
          url: `/devotion-plan/${id}/devotions/${devotionId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["DevotionPlans"],
    }),
    deletePlanDevotion: builder.mutation<{ message: string }, { id: string; devotionId: string }>({
      query: ({ id, devotionId }) => ({
        url: `/devotion-plan/${id}/devotions/${devotionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DevotionPlans"],
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
  useDeactivateUserMutation,
  useActivateUserMutation,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetDevotionsQuery,
  useCreateDevotionMutation,
  useUpdateDevotionMutation,
  useDeleteDevotionMutation,
  useGetAvailableYearsQuery,
  useGetDevotionsByYearQuery,
  useCreateDevotionsForNewYearMutation,
  useGetCurrentUserQuery,
  useSendMessageMutation,
  useGetAnalyticsQuery,
  useGetPerformanceAnalyticsQuery,
  useGetDeletedUsersCountQuery,
  useGetContactsQuery,
  useSendContactReplyMutation,
  useGetDevotionPlansQuery,
  useGetDevotionPlanByIdQuery,
  useCreateDevotionPlanMutation,
  useUpdateDevotionPlanMutation,
  useDeleteDevotionPlanMutation,
  useStartDevotionPlanMutation,
  useRecordDevotionPlanProgressMutation,
  useGetMyDevotionPlansQuery,
  useGetPlanDevotionsQuery,
  useCreatePlanDevotionMutation,
  useUpdatePlanDevotionMutation,
  useDeletePlanDevotionMutation,
} = apiSlice;