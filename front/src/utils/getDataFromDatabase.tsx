import { getAccessToken } from "./generic";

export default function GetAndSetData(stateSetter : any, fetchUrl : string) {

	let profile = fetch(fetchUrl, {
		headers : {
			'Authorization' : 'Bearer ' + getAccessToken(),
		},
		credentials : 'include',
	});
	
	profile 
		.then(resp => resp.json())
		.then(data => stateSetter(data))
		.catch(error => console.log("Error : " + error)); // Create an error component
}