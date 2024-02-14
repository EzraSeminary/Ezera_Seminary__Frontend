import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SSLapi = createApi({
  reducerPath: "SSLapi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sabbath-school-stage.adventech.io/api/v2/",
  }),
  endpoints: (builder) => ({
    getSSLs: builder.query<void, unknown>({
      query: () => "am/quarterlies/index.json",
    }),
    getSSLOfQuarter: builder.query({
      query: (path) => `am/quarterlies/${path}/index.json`,
    }),
    getSSLOfDay: builder.query({
      query: ({ path, id }) =>
        `am/quarterlies/${path}/lessons/${id}/index.json`,
    }),
    getSSLOfDayLesson: builder.query({
      query: ({ path, id, day }) =>
        `am/quarterlies/${path}/lessons/${id}/days/${day}/read/index.json`,
    }),
  }),
});

export const {
  useGetSSLsQuery,
  useGetSSLOfQuarterQuery,
  useGetSSLOfDayQuery,
  useGetSSLOfDayLessonQuery,
} = SSLapi;
