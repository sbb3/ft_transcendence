import { useEffect, useState } from "react";
import fetchQrCode from "../utils/qrCode";

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
		fetchQrCode(setQr);
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