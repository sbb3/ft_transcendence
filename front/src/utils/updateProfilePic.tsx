import { getAccessToken, isExpired } from "../utils/utils";

function updateProfilePic(fetchUrl : string, file : any) {
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
				postProfilePic(fetchUrl, file, data.access_token);
			});
	}
	else
		postProfilePic(fetchUrl, file, null);
}

function postProfilePic(fetchUrl : string, file : any, token : string | null) {
	const formData = new FormData();

	formData.append('file', file);
	const data = fetch(fetchUrl, {
		method : 'POST',
		credentials: 'include',
		headers : {
			'Authorization' : 'Bearer ' + (token ? token : getAccessToken()),
		},
		body : formData,
	});
	data
		.then(resp => console.log(resp));
}

export default updateProfilePic;