import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ApiState {
  id: number;
  _id: string;
  title: string;
  description: string;
  image: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5100/",
    baseUrl: "https://ezra-seminary.mybese.tech/",
  }),
  endpoints: (builder) => ({
    getCourses: builder.query<ApiState[], void>({
      query: () => "course/getall",
    }),
    getCourseById: builder.query<ApiState, number>({
      query: (id) => `course/get/${id}`,
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery } = api;
