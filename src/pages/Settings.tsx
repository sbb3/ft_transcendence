// import { FileUploader } from "react-drag-drop-files";

import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useTitle from "src/hooks/useTitle";

const Settings = () => {
    useTitle("Settings");
    const navigate = useNavigate();
    return (
        <div>
            Settings
            <Button colorScheme="purple" variant="solid" size="lg"
				onClick={() => {
					navigate(-1);
				}}
			>
				go back to previous page
			</Button>
        </div>
    );
};

export default Settings;