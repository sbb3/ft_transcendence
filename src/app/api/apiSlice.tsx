import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "src/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost:3000/api",
	credentials: "include", // include cookies, credentials, and HTTP authentication in the request, even for cross-origin requests to the API (https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
	prepareHeaders: (headers, { getState }: any) => {
		const accessToken = getState().auth.accessToken;
		if (accessToken) {
			headers.set("authorization", `Bearer ${accessToken}`);
		}
		return headers;
	},
});

// TODO: change query status code in the baseQuery
const baseQueryJWTverify = async (args: any, api: any, extraOptions: any) => {
	const originalQuery = await baseQuery(args, api, extraOptions);
	if (originalQuery?.error?.status === 403) { //  access token  expired.  we get new access token using the refresh token.
		const retryQueryWithRefreshToken = await baseQuery('/auth/refresh', api, extraOptions)
		if (retryQueryWithRefreshToken?.data) { // success to get new access token, we retry the original request, but with the new access token.
			const retryQueryWithNewToken = await baseQuery(args, api, extraOptions)
			return retryQueryWithNewToken;
		} else { // we failed to get a new access token, send logout, then redirect to login.
			if (retryQueryWithRefreshToken?.error?.status === 403) {
				api.dispatch(logOut());
			}
			return retryQueryWithRefreshToken;
		}
	}
	return originalQuery;
};

export const apiSlice = createApi({
	baseQuery: baseQueryJWTverify,
	tagTypes: [""], // TODO: set up tagTypes
	endpoints: () => ({}),
});
