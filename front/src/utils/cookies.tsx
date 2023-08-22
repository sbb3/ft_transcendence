import jwtDecode from "jwt-decode";

function getAccessToken() : string | undefined {
	console.log(document.cookie);
    return document.cookie.split(';')?.find(value => value.includes("tr_access_token"))?.split('=')[1];
}

function isExpired(token : string) : boolean {

    // If it is not found, I should make  request to renew my token
    const decodedToken : any = jwtDecode(token);

    return decodedToken.exp <= Date.now() / 1000;
}

function requestToken() {
    const token = getAccessToken();

    if (!token || isExpired(token))
        fetch('http://localhost:3000/auth/refresh');

}

function tokenCheck(setUserProfile : any)
{
        const token = getAccessToken();
		let expired = false;

		if (token)
			expired = isExpired(token);

		if (expired)
		{
			const newToken = fetch('http://localhost:3000/auth/refresh', {
				credentials : 'include'
			});

			newToken
				.then(resp => resp.json())
				.then(data => {
					let profile = fetch('http://localhost:3000/user/profile', {
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
			console.log("here trying to access cookies");
			let profile = fetch('http://localhost:3000/user/profile', {
				headers : {
					'Authorization' : 'Bearer ' + getAccessToken(),
				},
				credentials : 'include',
			});
	
			profile 
				.then(resp => resp.json())
				.then(data => setUserProfile(data))
				.catch(error => console.log("Error : " + error));
		}
}

export default requestToken;
export { getAccessToken, isExpired, tokenCheck };