import { useEffect } from "react";


function TwoFactorAuth() {

    useEffect(() => {
        let data = fetch('http://localhost:3000/auth/2fa', {
            credentials : 'include'
        });

        data
            .then(response => console.log(response));
    })
    return (
        <h1>Hello from two factor auth</h1>
    );
}

export default TwoFactorAuth;