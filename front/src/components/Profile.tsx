import { useEffect, useState } from "react";
import { tokenCheck } from "../utils/cookies";

interface UserProfile {
	username : string;
	given_name : string;
	last_name : string;
}

function Profile() {

	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		tokenCheck(setUserProfile);
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