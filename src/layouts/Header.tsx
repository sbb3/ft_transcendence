import { Flex } from "@chakra-ui/react";
import Search from "src/components/Search";
import Notifications from "src/components/Notifications";

const Header = () => {
  return (
    <Flex
      direction='row' justify='space-between' align='center' w='full'
      p={2}
      ml={1}
      // bg="pong_bg_secondary"
      // outline="2px solid yellow"
      bg="pong_bg_secondary"
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.69)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Search />
      <Notifications />
    </Flex>
  );
};

export default Header;
