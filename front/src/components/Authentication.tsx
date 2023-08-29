import '../style/Authentication.css'

function Authentication() {
	return (
		<div id="auth-block">
			<a href='http://localhost:3000/auth/42/oauth2' id='auth-init'>42 sign in</a>
			<a href='http://localhost:3000/auth/google/oauth2' id='auth-init'>Google sign in</a>
		</div>
		);
}

export default Authentication;