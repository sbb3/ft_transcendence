import jwtDecode from "jwt-decode";

function getAccessToken() : string | undefined {
    return document.cookie.split(';')?.find(value => value.includes("tr_access_token"))?.split('=')[1];
}

function isExpired(token : string) : boolean {

    const decodedToken : any = jwtDecode(token);

    return decodedToken.exp <= Date.now() / 1000;
}

function fetchAndSetData(stateSetter : any, fetchUrl : string, refresh_token : string | undefined) {

	let profile = fetch(fetchUrl, {
		headers : {
			'Authorization' : 'Bearer ' + (refresh_token ? refresh_token : getAccessToken()),
		},
		credentials : 'include',
	});
	
	profile 
		.then(resp => resp.json())
		.then(data => stateSetter(data))
		.catch(error => console.log("Error : " + error)); // Initialize a variable to make sure that the user sees the error
}

function checkTokenAndFetch(stateSetter : any, fetchUrl : string)
{
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
				.then(data => fetchAndSetData(stateSetter, fetchUrl, data.refresh_token));
		}
		else
			fetchAndSetData(stateSetter, fetchUrl, undefined);
}

export default checkTokenAndFetch;