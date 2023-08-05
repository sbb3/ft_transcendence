import '../style/Authentication.css'

function Authentication() {
	return (
		<div id="authentication-block">
			<a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-dd71a61e34d9d6aa59bb09874dd23613dccfa795bc415cca9b062ccfd9a52193&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code">Login</a>
		</div>
	);
}

export default Authentication;