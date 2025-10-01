import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiState } from "@/redux/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ezrabackend.online/",
    // baseUrl: "http://localhost:5100/",
  }),
  endpoints: (builder) => ({
    getCourses: builder.query<ApiState[], void>({
      query: () => "course/getall",
    }),
    getCourseById: builder.query<ApiState, string>({
      query: (id) => `course/get/${id}`,
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery } = api;
