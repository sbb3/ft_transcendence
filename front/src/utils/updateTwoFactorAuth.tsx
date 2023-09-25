import { getAccessToken, isExpired } from "./utils";

export default function updateTwoFactorAuth(activate : boolean) {
	const token = getAccessToken();
	let expired = true;

	if (token)
		expired = isExpired(token);
	if (expired)
	{
		const newToken = fetch('http://localhost:3000/auth/refresh', {
			method : 'POST',
			credentials : 'include',
			headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
			},
			body : 'grant_type=refresh_token'
		});

		newToken
			.then(resp => {
				if (resp.status != 201)
					window.location.replace("http://localhost:5173"); // Create an error page
				return resp.json();
			})
			.then(data => {
				updateTwoFactorState(activate, data.access_token);
			});
	}
	else
		updateTwoFactorState(activate, null);
}
	
function updateTwoFactorState(activate : boolean, token : null | string) {

	const respData = fetch("http://localhost:3000/auth/twoFactorAuthStatus", {
		method : 'PUT',
		credentials : 'include',
		headers : {
			'Content-Type' : 'application/json',
			'Authorization' : 'Bearer ' + (token ? token : getAccessToken()),
		},
		body : JSON.stringify({isTwoFaEnabled : activate}),
	});

	respData
		.then(resp => {
			if (resp.status != 200 || activate)
				window.location.replace('http://localhost:5173/');
			window.location.replace('http://localhost:5173/profile');
		});
}