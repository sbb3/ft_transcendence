import jwtDecode from "jwt-decode";

function getAccessToken() : string | undefined {
	return document.cookie.split(';')?.find(value => value.includes("tr_access_token"))?.split('=')[1];
}

// To remove export later
export function isExpired(token : string) : boolean {

	const decodedToken : any = jwtDecode(token);

	return decodedToken.exp <= Date.now() / 1000;
}

function sendTokenAndFetch(functionToCall : any) {
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
				functionToCall;
			});
	}
	else
		functionToCall;
}

export default sendTokenAndFetch;
export { getAccessToken };