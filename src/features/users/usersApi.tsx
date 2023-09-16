import { apiSlice } from "src/app/api/apiSlice";

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getUsers: builder.query({
      query: () => "users",
    }),
    getUserById: builder.query({
      query: (id: number) => `users/${id}`,
    }),
    getUserByUsername: builder.query({
      query: (username: string) => `users/${username}`,
    }),
    getUserByEmail: builder.query({
      query: (email: string) => `users?email=${email}`,
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const users = result?.data;
          // if (users?.length === 0) {
          //   throw new Error("user not found");
          // }
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByUsernameQuery,
  useGetUserByEmailQuery,
  useUpdateUserMutation,
} = usersApi;

export default usersApi;
