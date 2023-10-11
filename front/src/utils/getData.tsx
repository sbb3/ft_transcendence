import { getAccessToken } from "./utils";
import { isExpired } from "./utils";

export default function getData(stateSetter : any, fetchUrl : string) {
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
				fetchAndSet(stateSetter, fetchUrl, data.access_token);
			});
	}
	else
		fetchAndSet(stateSetter, fetchUrl, null);
}

function fetchAndSet(stateSetter : Function, fetchUrl : string, token : string | null) {

	let profile = fetch(fetchUrl, {
		headers : {
			'Authorization' : 'Bearer ' + (token ? token : getAccessToken()),
		},
		credentials : 'include',
	});
		
	profile 
		.then(resp => resp.json())
		.then(data => stateSetter(data)) // Catch the error

} 