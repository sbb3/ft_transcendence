import { apiSlice } from "../../app/api/apiSlice";
import { setCredentials, logOut } from "/src/redux/slices/authSlice";

const authApiEndpoints = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		sendLogIn: builder.mutation({
			query: (credentials) => ({
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
		getNewAccessToken: builder.query({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
		}),
	}),
});

export const {
	useSendLogInMutation,
	useSendLogOutMutation,
	useGetNewAccessTokenQuery,
} = authApiEndpoints;
