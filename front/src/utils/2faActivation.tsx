import { getAccessToken, isExpired } from "./cookies";

function activate2FA(activate : boolean) {

    // There is a repetition here, to change later (Test purposes)
    // To automate the fetching requests with the access_tokens + refresh token fetch
    const token = getAccessToken();
    let expired = true;

    if (token)
        expired = isExpired(token);
    if (expired)
    {
        const newToken = fetch('http://localhost:3000/auth/refresh', {
            method : 'POST',
            credentials : 'include',
            headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body : 'grant_type=refresh_token'
        });
        newToken
            .then(resp => {
                if (resp.status != 201)
                    window.location.replace("http://localhost:5173"); // Create an error page
                return resp.json();
            })
            .then(data => {
                    const respData = fetch('http://localhost:3000/auth/twoFactorAuthStatus', {

                    method : 'PUT',
                    credentials : 'include',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : 'Bearer ' + data.access_token,
                    },
                    body : JSON.stringify({isTwoFaEnabled : activate}),
                });

                respData
                    .then(resp => {
                        if (resp.status != 200)
                            window.location.replace('http://localhost:5173/');
                        window.location.replace('http://localhost:5173/profile');
                    });
            });
    }
    
    const respData = fetch('http://localhost:3000/auth/twoFactorAuthStatus', {
        method : 'PUT',
        credentials : 'include',
        headers : {
            'Content-Type' : 'application/json',
			'Authorization' : 'Bearer ' + (token),
        },
        body : JSON.stringify({isTwoFaEnabled : activate}),
    });

    respData
        .then(resp => {
            if (resp.status != 200)
                window.location.replace('http://localhost:5173/');
            window.location.replace('http://localhost:5173/profile');
        });
}

export default activate2FA;