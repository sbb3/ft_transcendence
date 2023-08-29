import { getAccessToken, isExpired } from "./utils";

function logout() : void {
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
                fetchLogoutUrl(data.access_token);
			});
	}
	else
        fetchLogoutUrl(null);
}

function fetchLogoutUrl(token : string | null) {

    const logoutResponse = fetch('http://localhost:3000/auth/logout', {
        method : 'DELETE',
        credentials : 'include',
        headers : {
            'Authorization' : 'Bearer ' + (token ? token : getAccessToken()),
        }
    });

    logoutResponse
        .then(resp => {
            // Check for the 404 status and create a 404 page.
            window.location.replace('http://localhost:5173/');
        })
}

export default logout;