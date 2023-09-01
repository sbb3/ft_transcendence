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
					const { data: userInfo } = await queryFulfilled;
					dispatch(setLogin(userInfo));
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
					const {data: userInfo} = await queryFulfilled;
					// !! rename newAccessToken to accessToken
					// !! const accessToken = data?.data?.newAccessToken;
					// console.log(`newAccessToken: ${accessToken}`);
					dispatch(setLogin(userInfo));

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
