import jwtDecode from "jwt-decode";

function getAccessToken() : string | undefined {
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

export default requestToken;
export { getAccessToken, isExpired };