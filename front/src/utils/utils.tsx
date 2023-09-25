import jwtDecode from "jwt-decode";

function getAccessToken() : string | undefined {
	return document.cookie.split(';')?.find(value => value.includes("tr_access_token"))?.split('=')[1];
}

// To remove export later
function isExpired(token : string) : boolean {

	const decodedToken : any = jwtDecode(token);

	return decodedToken.exp <= Date.now() / 1000;
}

export { getAccessToken, isExpired };