import { apiSlice } from "src/app/api/apiSlice";

const leaderboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: () => "leaderboard",
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;

export default leaderboardApi;
