import { useEffect, useState } from "react";
import GetAndSetData from "../utils/getDataFromDatabase";
import logout from "../utils/logout";
import sendTokenAndFetch from "../utils/generic";
import updateTwoFactorAuth from "../utils/2faActivation";

interface UserProfile {
	username : string;
	name : string;
	lastName : string;
	profileImage : string;
}

function Profile() {

	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		sendTokenAndFetch(GetAndSetData(setUserProfile, "http://localhost:3000/user/profile"));
	}, []);

	return (
		userProfile ?
		<div id='profile-block'>
			<div id='user-infos'>
				<img src={userProfile.profileImage} id="profileImage"/>
				<h2>Name : {userProfile.name}</h2>
				<h2>Last name : {userProfile.lastName}</h2>
				<h2>Username : {userProfile.username}</h2>
			</div>
			<button onClick={() => logout()}>Logout</button>
			<button onClick={() => {
				sendTokenAndFetch(updateTwoFactorAuth(true, 'http://localhost:3000/auth/twoFactorAuthStatus'));
			}} style={{marginTop : '10px'}}>Activate 2fa</button>
			<button style={{marginTop : '10px'}} onClick={() => {
				sendTokenAndFetch(updateTwoFactorAuth(false, 'http://localhost:3000/auth/twoFactorAuthStatus'));
			}}>Deactivate 2fa</button>
		</div>
		: <h1>Still waiting for data</h1>
	);

}

export default Profile;