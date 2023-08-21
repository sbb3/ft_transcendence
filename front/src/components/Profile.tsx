import { useEffect, useState } from "react";
import requestToken, { getAccessToken, isExpired } from "../utils/cookies";

interface UserProfile {
	username : string;
	given_name : string;
	last_name : string;
}

function Profile() {

	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {

		const token = getAccessToken();
		let expired = false;

		if (token)
			expired = isExpired(token);

		if (expired)
		{
			const newToken = fetch('http://localhost:3000/auth/refresh');

			newToken
				.then(resp => resp.json())
				.then(data => {
					
					console.log("Here asking for a new access token");
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
					});
		}
		else
		{
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