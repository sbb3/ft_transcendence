import { Flex } from "@chakra-ui/react";
import Search from "src/components/Search";
import useTitle from "src/hooks/useTitle";
import Notification from "src/components/Notifications";

const Header = () => {
  useTitle("Header");
  return (
    <Flex
      // h={1000}
      // h={64}
      bg="gray"
      //   alignItems={"center"}
      //   justifyContent={"space-between"}
      p={4}
    >
      <Search />
      {/* <Notificblockmangation /> */}
    </Flex>
  );
};

export default Header;
