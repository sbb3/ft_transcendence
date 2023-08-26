


function fetchQrCode(stateSetter : any) {
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
				stateSetter(data.qrCode);
			});
}

export default fetchQrCode;