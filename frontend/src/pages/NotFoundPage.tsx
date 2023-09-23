import { Flex, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useLottie } from "lottie-react";
import useTitle from "src/hooks/useTitle";
import animationData from "/src/assets/animations/404.json";

const NotFoundPage = () => {
  useTitle("404 Not Found");
  const navigate = useNavigate();

  const style = {
    width: "100%",
    height: "100%",
  };
  const options = {
    loop: true,
    autoplay: true,
    animationData,
  };

  const { View } = useLottie(options, style);

  return (
    <>
      <Flex
        justifyContent={"center"}
        align="center"
        w="full"
        h="full"
        bg="white"
      >
        {/* <Link
				pos="relative"
				as={RouterLink}
				onClick={() => navigate(-1)}
				w="100vw"
				h="100vh"
				cursor="pointer"
				overflow="hidden"
			>
				{View}
			</Link> */}
        Not found
      </Flex>
    </>
  );
};

export default NotFoundPage;
