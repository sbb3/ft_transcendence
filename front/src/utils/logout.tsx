function logout() {
    const logoutResponse = fetch('http://localhost:3000/auth/logout', {
        method : 'DELETE',
        credentials : 'include'
    })

    logoutResponse
        .then(resp => {
            // Check for the 404 status and create a 404 page.
            window.location.replace('http://localhost:5173/');
        })
}

export default logout;