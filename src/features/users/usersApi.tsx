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
            query: (email: string) => `users/${email}`,
        }),
        updateUser: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `users/${id}`,
                method: "PATCH",
                body: patch,
            }),
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useGetUserByUsernameQuery, useGetUserByEmailQuery, useUpdateUserMutation } = usersApi;


export default usersApi;