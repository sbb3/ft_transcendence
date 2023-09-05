import { Flex } from "@chakra-ui/react";
import Search from "src/components/Search";
import Notifications from "src/components/Notifications";

const Header = () => {
  return (
    <Flex
      direction='row' justify='space-between' align='center' w='full'
      p={4}
    >
      <Search />
      <Notifications />
    </Flex>
  );
};

export default Header;
