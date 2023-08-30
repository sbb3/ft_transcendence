import { apiSlice } from "../../app/api/apiSlice";
import { setCredentials } from "./authSlice";

const authApiEndpoints = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		sendLogIn: builder.mutation({
			query: (credentials: any) => ({
				url: "/auth/login",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		sendLogOut: builder.mutation({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
		}),
		getNewAccessToken: builder.mutation({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const {data: {newAccessToken: accessToken}}: any = await queryFulfilled;
					// const accessToken = data?.data?.newAccessToken;
					// console.log(`newAccessToken: ${accessToken}`);
					dispatch(setCredentials({ accessToken }));

				} catch (err: any) {
					console.log(`err: `, err);
					return ;
				}
			}
		}),
	}),
});

export const {
	useSendLogInMutation,
	useSendLogOutMutation,
	useGetNewAccessTokenMutation,
} = authApiEndpoints;
