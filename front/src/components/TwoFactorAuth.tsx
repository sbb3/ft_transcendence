import { useEffect, useState } from "react";


function TwoFactorAuth() {

	const [qr, setQr] = useState<string | undefined>(undefined);

	useEffect(() => {
		let data = fetch('http://localhost:3000/auth/2fa', {
			credentials : 'include'
		});

		data
			.then(response => {
				return response.json()
			})
			.then(data => {
				setQr(data.qrCode);
			});
	})
	return (
		<div id="qr-block">
			<h2>Hello from two factor auth</h2>
			<h3>Please scan this code</h3>
			{qr ? <img src={qr}/> : <></>}
			<h3>After scanning enter the verification code</h3>

			<label htmlFor="verification-code">Verification code</label>
			<input type="text" id="verification-code"/>
		</div>

	);
}

export default TwoFactorAuth;