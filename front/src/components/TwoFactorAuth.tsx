import { useEffect, useState } from "react";
import getQrCode from "../utils/getQrCode";
import sendVerificationCode from "../utils/sendVerificationCode";


function TwoFactorAuth() {

	const [qr, setQr] = useState<string | undefined>(undefined);
	const [code, setCode] = useState<string>("");

	useEffect(() => {
		getQrCode(setQr);
	});

	return (
		<div id="qr-block">
			<h2>Hello from two factor auth</h2>
			<h3>Please scan this code</h3>
			{qr ? <img src={qr}/> : <></>}
			<h3>After scanning enter the verification code</h3>

			<label htmlFor="verification-code">Verification code</label>
			<input type="text" id="verification-code" onChange={(e) => setCode(e.target.value)}/>
			<button onClick={() => sendVerificationCode(code)}>Submit</button>
		</div>
	);
}

export default TwoFactorAuth;