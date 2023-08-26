import { useEffect, useState } from "react";

function sendCode(code : string | undefined) {
	const responseData = fetch('http://localhost:3000/auth/2fa/verification', {
		method : 'POST',
		credentials : 'include',
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
		},
		body : 'verificationCode=' + code,
	});

	responseData
		.then(resp => {
			if (resp.status != 201)
				window.location.replace('http://localhost:5173/');
			else
				window.location.replace('http://localhost:5173/profile');
		})
}

function TwoFactorAuth() {

	const [qr, setQr] = useState<string | undefined>(undefined);
	const [code, setCode] = useState<string>("");

	useEffect(() => {
		let data = fetch('http://localhost:3000/auth/2fa', {
			credentials : 'include'
		});

		data
			.then(response => {
				if (response.status != 200)
					window.location.replace('http://localhost:5173');
				return response.json()
			})
			.then(data => {
				setQr(data.qrCode);
			});
	});

	return (
		<div id="qr-block">
			<h2>Hello from two factor auth</h2>
			<h3>Please scan this code</h3>
			{qr ? <img src={qr}/> : <></>}
			<h3>After scanning enter the verification code</h3>

			<label htmlFor="verification-code">Verification code</label>
			<input type="text" id="verification-code" onChange={(e) => setCode(e.target.value)}/>
			<button onClick={() => sendCode(code)}>Submit</button>
		</div>

	);
}

export default TwoFactorAuth;