import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useTitle from "src/hooks/useTitle";

function Overview() {
	useTitle("Ping Pong");
	const navigate = useNavigate();
	return (
		<div>
			<h1>Overview</h1>
			{/* <Button colorScheme="purple" variant="solid" size="lg"
				onClick={() => {
					navigate("/settings");
				}}
			>
				Settings
			</Button> */}
		</div>
	);
}
export default Overview;
