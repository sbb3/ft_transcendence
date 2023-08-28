import { useEffect, useState } from "react";
import checkTokenAndFetch from "../utils/cookies";
import logout from "../utils/logout";
import activate2FA from "../utils/2faActivation";

interface UserProfile {
	username : string;
	given_name : string;
	last_name : string;
}

function Profile() {

	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		checkTokenAndFetch(setUserProfile, "http://localhost:3000/user/profile");
	}, []);

	return (
		userProfile ?
		<div id='profile-block'>
			<div id='user-infos'>
				<h2>Name : {userProfile.given_name}</h2>
				<h2>Last name : {userProfile.last_name}</h2>
				<h2>Username : {userProfile.username}</h2>
			</div>
			<button onClick={() => logout()}>Logout</button>
			<button onClick={() => {
				activate2FA(true);
			}} style={{marginTop : '10px'}}>Activate 2fa</button>
			<button style={{marginTop : '10px'}} onClick={() => {
				activate2FA(false);
			}}>Deactivate 2fa</button>
		</div>
		: <h1>Still waiting for data</h1>
	);

}

export default Profile;