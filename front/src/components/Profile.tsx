import { useEffect } from "react";

function Profile() {

	useEffect(() => {

		let test;

		test = fetch('http://localhost:3000/auth/test');

		test
			.then(resp => resp.json())
			.then(data => console.log(data))
			.catch(error => console.log(error));

	}, []);

	return (
		<h1>Hello from profile component</h1>
	);

}

export default Profile;