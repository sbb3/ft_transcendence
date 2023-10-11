import { useEffect, useState } from "react";
import getData from "../utils/getData";
import logout from "../utils/logout";
import updateProfilePic from "../utils/updateProfilePic";
import updateTwoFactorAuth from "../utils/updateTwoFactorAuth";

interface UserProfile {
	username : string;
	name : string;
	profileImage : string;
	avatar : string;
	email : string;
}

function Profile() {
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [file, setFile] = useState<any>(null)

	const uploadFile = () => {
		if (!file) // Check if the type of the image is valid (or in input accept)
			console.log("Please select a file");
		else
			updateProfilePic('http://localhost:3000/user/upload', file);
	}

	useEffect(() => {
		getData(setUserProfile, "http://localhost:3000/user/profile");
	}, []);

	return (
		userProfile ?
		<div id='profile-block'>
			<div id='user-infos'>
				<img src={userProfile.avatar} id="profileImage" style={{width: "11vw", height: "11vw"}}/>
				<h2>Name : {userProfile.name}</h2>
				<h2>Username : {userProfile.username}</h2>
				<h2>Email : {userProfile.email}</h2>
			</div>
			{/* <button onClick={() => logout()}>Logout</button>
			<button onClick={() => {
				updateTwoFactorAuth(true);
			}} style={{marginTop : '10px'}}>Activate 2fa</button>
			<button style={{marginTop : '10px'}} onClick={() => {
				updateTwoFactorAuth(false);
			}}>Deactivate 2fa</button> */}

			{/* Profile Picture Upload */}
			{/* <input style={{marginTop: '20px'}} name="file" type="file" id="image-upload" onChange={(e : any) => setFile(e.target.files[0])} />
			<button style={{marginTop: '20px'}} onClick={uploadFile}>Upload file</button> */}
		</div>
		: <h1>Still waiting for data</h1>
	);
}

export default Profile;