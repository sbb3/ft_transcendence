import jwtDecode from "jwt-decode";

function getAccessToken() : string | undefined {
    return document.cookie.split(';')?.find(value => value.includes("tr_access_token"))?.split('=')[1];
}

function isExpired(token : string) : boolean {

    const decodedToken : any = jwtDecode(token);

    return decodedToken.exp <= Date.now() / 1000;
}

async function tokenCheck(setUserProfile : any, fetchUrl : string)
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
						"Content-Type" : 'application/x-www-form-urlencoded'
				},
				body : "grant_type=refresh_token"
			});

			newToken
				.then(resp => {
					if (resp.status != 201)
						window.location.replace("http://localhost:5173");
					return resp.json();
				})
				.then(data => {
					let profile = fetch(fetchUrl, {
						headers : {
							'Authorization' : 'Bearer ' + data.access_token,
						},
						credentials : 'include',
					});
	
					profile 
						.then(resp => resp.json())
						.then(profileData => setUserProfile(profileData))
						.catch(error => console.log("Error : " + error));
					});
		}
		else
		{
			let profile = fetch(fetchUrl, {
				headers : {
					'Authorization' : 'Bearer ' + getAccessToken(),
				},
				credentials : 'include',
			});
	
			profile 
				.then(resp => resp.json())
				.then(data => setUserProfile(data))
				.catch(error => console.log("Error : " + error)); // To initialize here a variable to make sure that the user sees the error
		}
}

export default tokenCheck;