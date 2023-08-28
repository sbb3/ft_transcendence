import { getAccessToken } from "./generic";

export default function updateTwoFactorAuth(activate : boolean, url : string) {
	
	const respData = fetch(url, {
		method : 'PUT',
		credentials : 'include',
		headers : {
			'Content-Type' : 'application/json',
			'Authorization' : 'Bearer ' + getAccessToken(),
		},
		body : JSON.stringify({isTwoFaEnabled : activate}),
	});

	respData
		.then(resp => {
			if (resp.status != 200)
				window.location.replace('http://localhost:5173/');
			window.location.replace('http://localhost:5173/profile');
		});
}