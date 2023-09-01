import { apiSlice } from "../../app/api/apiSlice";
import { setLogout, setLogin } from "./authSlice";

const authApiEndpoints = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		sendLogIn: builder.mutation({
			query: (credentials: any) => ({
				url: "/auth/login",
				method: "POST",
				body: { ...credentials },
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data: { accessToken } } = await queryFulfilled;
					dispatch(setLogin({ accessToken }));
				} catch (err: any) {
					console.log(`err: `, err);
					return ;
				}
			}
		}),
		sendLogOut: builder.mutation({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(setLogout());
				} catch (err: any) {
					console.log(`err: `, err);
					return ;
				}
			}
		}),
		getNewAccessToken: builder.mutation({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const {data: {newAccessToken: accessToken}} = await queryFulfilled;
					// const accessToken = data?.data?.newAccessToken;
					// console.log(`newAccessToken: ${accessToken}`);
					dispatch(setLogin({ accessToken }));

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
