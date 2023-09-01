// import { Image } from '@chakra-ui/image';
import { Box, Flex } from "@chakra-ui/layout";
import { Button, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
const MotionImage = motion(Image);

const Circle = () => {
  return (
    <Box
      // as="svg"
      position="absolute"
      top="50%"
      left="50%"
      transform={{
        base: "translate(-50%, -75%)",
        sm: "translate(-50%, -75%)",
        md: "translate(-50%, -50%)",
      }}
      zIndex="-9999"
      w={{ base: "70%", sm: "70%", md: "550px" }}
      h={{ base: "70%", sm: "70%", md: "550px" }}
      opacity="0.3"
      mixBlendMode="lighten"
      fill="pong_cl_primary"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 579 579">
        <path d="M289.5 579C449.386 579 579 449.386 579 289.5C579 129.614 449.386 0 289.5 0C129.614 0 0 129.614 0 289.5C0 449.386 129.614 579 289.5 579Z" />
      </svg>
    </Box>
  );
};

const Blackhole = () => {
  return (
    <Box
      mixBlendMode="lighten"
      // as="svg"
      position="absolute"
      top="50%"
      left="50%"
      zIndex="1"
      opacity="0.1"
      transform={{
        base: "translate(-50%, -75%)",
        sm: "translate(-50%, -75%)",
        md: "translate(-50%, -50%)",
      }}
      w={{ base: "70%", sm: "70%", md: "550px" }}
      h={{ base: "70%", sm: "70%", md: "550px" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="579"
        height="582"
        viewBox="0 0 579 582"
        fill="none"
      >
        <path
          d="M289.5 582C449.386 582 579 451.715 579 291C579 130.285 449.386 0 289.5 0C129.614 0 0 130.285 0 291C0 451.715 129.614 582 289.5 582Z"
          fill="black"
        />
      </svg>
    </Box>
  );
};

const Background = ({ children }) => {
  return (
    <Box
      pos="relative"
      outline="1px solid red"
      w="750px"
      // filter="blur(5px)"
    >
      {/* <Circle /> */}
      {/* <Blackhole /> */}
      <Flex
        justify={"center"}
        pos="relative"
        width="100%"
        height="100%"
        outline="1px solid green"
      >
        <MotionImage
          src="src/assets/img/ping-pong-bg.png"
          alt="ping pong background"
          objectFit="cover"
          mixBlendMode="lighten"
          // boxShadow="0px 0px 28px 0px rgba(0, 0, 0, 0.20)"
          //   filter="blur(7px)"
          opacity={0.8}
          // animate={{ rotate: 360 }}
          // transition={{ ease: "linear", duration: 2, repeat: Infinity } as any}
        />
        <Button
          colorScheme="purple"
          variant="solid"
          size="lg"
          position="absolute"
          top="50%"
          left="50%"
        >
          Button
        </Button>
      </Flex>
    </Box>
  );
};

export default Background;
