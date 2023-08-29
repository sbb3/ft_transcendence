import { useEffect, useState } from "react";
import getData from "../utils/getData";
import logout from "../utils/logout";
import updateTwoFactorAuth from "../utils/updateTwoFactorAuth";

interface UserProfile {
	username : string;
	name : string;
	profileImage : string;
}

function Profile() {

	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		getData(setUserProfile, "http://localhost:3000/user/profile");
	}, []);

	return (
		userProfile ?
		<div id='profile-block'>
			<div id='user-infos'>
				<img src={userProfile.profileImage} id="profileImage"/>
				<h2>Name : {userProfile.name}</h2>
				<h2>Username : {userProfile.username}</h2>
			</div>
			<button onClick={() => logout()}>Logout</button>
			<button onClick={() => {
				updateTwoFactorAuth(true);
			}} style={{marginTop : '10px'}}>Activate 2fa</button>
			<button style={{marginTop : '10px'}} onClick={() => {
				updateTwoFactorAuth(false);
			}}>Deactivate 2fa</button>
		</div>
		: <h1>Still waiting for data</h1>
	);

}

export default Profile;