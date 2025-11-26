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
  tagTypes: ["Devotions", "DevotionComments"],
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
    // Devotion likes and comments endpoints
    toggleLikeDevotion: builder.mutation<
      { message: string; likesCount: number; isLiked: boolean },
      string
    >({
      query: (id) => ({
        url: `/devotion/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Devotions"],
    }),
    getDevotionLikes: builder.query<
      { likesCount: number; isLiked: boolean },
      string
    >({
      query: (id) => `/devotion/${id}/likes`,
      providesTags: (_result, _error, id) => [{ type: "Devotions", id }],
    }),
    addDevotionComment: builder.mutation<
      { message: string; comment: any },
      { id: string; text: string }
    >({
      query: ({ id, text }) => ({
        url: `/devotion/${id}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Devotions", id },
        { type: "DevotionComments", id },
      ],
    }),
    getDevotionComments: builder.query<
      { comments: any[]; count: number },
      string
    >({
      query: (id) => `/devotion/${id}/comments`,
      providesTags: (_result, _error, id) => [
        { type: "DevotionComments", id },
      ],
    }),
    deleteDevotionComment: builder.mutation<
      { message: string },
      { id: string; commentId: string }
    >({
      query: ({ id, commentId }) => ({
        url: `/devotion/${id}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Devotions", id },
        { type: "DevotionComments", id },
      ],
    }),
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => "/analytics",
    }),
    getPerformanceAnalytics: builder.query<PerformanceData, void>({
      query: () => "/analytics/performance",
    }),
    // Devotion Plan endpoints
    getDevotionPlans: builder.query<{ items: any[]; total: number }, void | {}>({
      query: () => "/devotionPlan",
    }),
    getDevotionPlanById: builder.query<any, string>({
      query: (id) => `/devotionPlan/${id}`,
    }),
    getMyDevotionPlans: builder.query<any[], { status?: string } | void>({
      query: (params) => {
        const queryParams = params?.status ? `?status=${params.status}` : "";
        return `/devotionPlan/user${queryParams}`;
      },
    }),
    startDevotionPlan: builder.mutation<{ message: string; userPlan: any }, string>({
      query: (id) => ({
        url: `/devotionPlan/${id}/start`,
        method: "POST",
      }),
    }),
    getDevotionPlanProgress: builder.query<any, string>({
      query: (id) => `/devotionPlan/${id}/progress`,
    }),
    updateDevotionPlanProgress: builder.mutation<
      { message: string; userPlan: any },
      { id: string; devotionId: string; completed: boolean }
    >({
      query: ({ id, devotionId, completed }) => ({
        url: `/devotionPlan/${id}/progress`,
        method: "PUT",
        body: { devotionId, completed },
      }),
    }),
    completeDevotionPlan: builder.mutation<{ message: string; userPlan: any }, string>({
      query: (id) => ({
        url: `/devotionPlan/${id}/complete`,
        method: "POST",
      }),
    }),
    restartDevotionPlan: builder.mutation<{ message: string; userPlan: any }, string>({
      query: (id) => ({
        url: `/devotionPlan/${id}/restart`,
        method: "POST",
      }),
    }),
    createDevotionPlan: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/devotionPlan",
        method: "POST",
        body: formData,
      }),
    }),
    updateDevotionPlan: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/devotionPlan/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteDevotionPlan: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/devotionPlan/${id}`,
        method: "DELETE",
      }),
    }),
    getPlanDevotions: builder.query<{ items: any[]; total: number }, { id: string }>({
      query: ({ id }) => `/devotionPlan/${id}/devotions`,
    }),
    createPlanDevotion: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/devotionPlan/${id}/devotions`,
        method: "POST",
        body: formData,
      }),
    }),
    updatePlanDevotion: builder.mutation<
      any,
      { id: string; devotionId: string; formData: FormData }
    >({
      query: ({ id, devotionId, formData }) => ({
        url: `/devotionPlan/${id}/devotions/${devotionId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deletePlanDevotion: builder.mutation<
      { message: string },
      { id: string; devotionId: string }
    >({
      query: ({ id, devotionId }) => ({
        url: `/devotionPlan/${id}/devotions/${devotionId}`,
        method: "DELETE",
      }),
    }),
    reorderPlanDevotion: builder.mutation<
      { message: string },
      { id: string; devotionId: string; direction: "up" | "down" }
    >({
      query: ({ id, devotionId, direction }) => ({
        url: `/devotionPlan/${id}/devotions/${devotionId}/reorder`,
        method: "POST",
        body: { direction },
      }),
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
  useToggleLikeDevotionMutation,
  useGetDevotionLikesQuery,
  useAddDevotionCommentMutation,
  useGetDevotionCommentsQuery,
  useDeleteDevotionCommentMutation,
  useGetCurrentUserQuery,
  useSendMessageMutation,
  useGetAnalyticsQuery,
  useGetPerformanceAnalyticsQuery,
  useGetDeletedUsersCountQuery,
  useGetContactsQuery,
  useSendContactReplyMutation,
  useGetDevotionPlansQuery,
  useGetDevotionPlanByIdQuery,
  useGetMyDevotionPlansQuery,
  useStartDevotionPlanMutation,
  useGetDevotionPlanProgressQuery,
  useUpdateDevotionPlanProgressMutation,
  useCompleteDevotionPlanMutation,
  useRestartDevotionPlanMutation,
  useCreateDevotionPlanMutation,
  useUpdateDevotionPlanMutation,
  useDeleteDevotionPlanMutation,
  useGetPlanDevotionsQuery,
  useCreatePlanDevotionMutation,
  useUpdatePlanDevotionMutation,
  useDeletePlanDevotionMutation,
  useReorderPlanDevotionMutation,
} = apiSlice;