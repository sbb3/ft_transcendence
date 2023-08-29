import useTitle from "src/hooks/useTitle";
import Profile from './components/Profile.tsx';

function Overview() {
	useTitle("Ping Pong Dashboard");
	return (
		<div>
			<h1>Dashboard</h1>
		</div>
	);
}
export default Overview;
