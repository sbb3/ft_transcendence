function logout() {
    const logoutResponse = fetch('http://localhost:3000/auth/logout', {
        method : 'DELETE',
        credentials : 'include'
    })

    logoutResponse
        .then(resp => {
            window.location.replace('http://localhost:5173/');
        })
}

export default logout;