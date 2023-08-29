function sendVerificationCode(code : string | undefined) {

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

export default sendVerificationCode;