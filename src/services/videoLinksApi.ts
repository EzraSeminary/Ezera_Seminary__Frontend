import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const videoLinksApi = createApi({
  reducerPath: "videoLinksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ezrabackend.online/",
  }),
  endpoints: (builder) => ({
    getVideoLink: builder.query({
      query: ({ year, quarter, lesson }) =>
        `sslLinks/${year}/${quarter}/${lesson}`,
    }),
    addVideoLink: builder.mutation({
      query: (newLink) => ({
        url: "sslLinks",
        method: "POST",
        body: newLink,
      }), 
    }),
    updateVideoLink: builder.mutation({
      query: ({ year, quarter, lesson, ...updatedLink }) => ({
        url: `sslLinks/${year}/${quarter}/${lesson}`,
        method: "PUT",
        body: updatedLink,
      }),
    }),
    deleteVideoLink: builder.mutation({
      query: ({ year, quarter, lesson }) => ({
        url: `sslLinks/${year}/${quarter}/${lesson}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetVideoLinkQuery,
  useAddVideoLinkMutation,
  useUpdateVideoLinkMutation,
  useDeleteVideoLinkMutation,
} = videoLinksApi;
