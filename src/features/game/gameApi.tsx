import { apiSlice } from "src/app/api/apiSlice";

const gameApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGames: builder.query({
      query: () => "games",
    }),
    getGameById: builder.query({
      query: (id) => `games/${id}`,
    }),
    // sendGameChallenge: builder.mutation({
    //     query: (data) => ({
    //         url: "games/challenge",
    //         method: "POST",
    //         body: { ...data },
    //     }),
    // }),
    acceptGameChallenge: builder.mutation({
      query: (data) => ({
        url: "games/challenge/accept",
        method: "POST",
        body: { ...data },
      }),
    }),
    getLeaderboard: builder.query({
      query: () => "leaderboard",
    }),
    getUserRecentGames: builder.query({
      query: (id) => `users/${id}/recentgames/`,
    }),
  }),
});

export const {
  useGetGamesQuery,
  useGetGameByIdQuery,
  useAcceptGameChallengeMutation,
  useGetLeaderboardQuery,
  useGetUserRecentGamesQuery,
} = gameApi;

export default gameApi;
