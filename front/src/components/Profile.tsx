import { useEffect, useState } from "react";

interface UserProfile {
	username : string;
	given_name : string;
	last_name : string;
}

function getAccessToken() : any {
	return document.cookie.split(';')?.find(value => value.includes("tr_access_token"))?.split("=")[1];
}

function Profile() {

	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {

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
			
	}, []);

	return (
		userProfile ?
		<div id='user-infos'>
			<h2>username : {userProfile.username}</h2>
			<h2>name : {userProfile.given_name}</h2>
			<h2>last name : {userProfile.last_name}</h2>
		</div>
		: <h1>Still waiting for data</h1>
	);
}

export default Profile;