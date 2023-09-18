import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { BeatLoader } from "react-spinners";
import { faker } from "@faker-js/faker";
import { BiSearchAlt } from "react-icons/bi";
import { useGetChannelsByIdQuery } from "src/features/channels/channelsApi";
import { useGetConversationsQuery } from "src/features/conversations/conversationsApi";
import { useSelector } from "react-redux";

const users = [...Array(30)].map(() => ({
  id: faker.string.uuid(),
  name: faker.internet.userName(),
  avatar: faker.image.avatar(),
}));

const SearchDMsChannels = () => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const {
    data: channels,
    isLoading: isLoadingChannels,
    error: errorChannels,
  } = useGetChannelsByIdQuery(currentUser.id, {
    refetchOnMountOrArgChange: true,
  });

  const { data: conversations, isLoading: isLoadingConversations } =
    useGetConversationsQuery(currentUser?.email, {
      refetchOnMountOrArgChange: true,
    });

  return (
    <Flex direction="row" align="center" justify="center">
      <AutoComplete
        // isLoading={isLoading}
        openOnFocus
        listAllValuesOnFocus
        closeOnSelect={true}
      >
        <InputGroup mr={4}>
          <AutoCompleteInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            value={query}
            mr={2}
            flex={1}
            variant="filled"
            bg="pong_bg.400"
            type="text"
            color="white"
            placeholder="Search DMs, Channels"
            _placeholder={{
              fontSize: 12,
              letterSpacing: 0.5,
              fontWeight: "light",
              opacity: 0.7,
              color: "gray.400",
            }}
            loadingIcon={<BeatLoader size={8} color="#FF8707" />}
          />
          <InputRightElement
            pointerEvents="none"
            children={<BiSearchAlt />}
            bg="pong_cl_primary"
            color="white"
            px={2}
            py={1}
            // borderTopLeftRadius="md"
            // borderBottomLeftRadius="md"
            border="1px solid var(--white, #FFF)"
            borderRadius="10px"
            cursor="pointer"
          />
        </InputGroup>

        <AutoCompleteList
          loadingState={<BeatLoader color="#FF8707" />}
          // style={{ backgroundImage: "url('src/assets/img/BlackNoise.png')" }}
          style={{
            borderRadius: "24px",
            border: "1px solid rgba(251, 102, 19, 0.39)",
            boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(20px)",
            backgroundImage: "url('src/assets/img/BlackNoise.png')",
            bgSize: "cover",
            bgRepeat: "no-repeat",
            backgroundColor: "transparent",
          }}
          closeOnSelect={false}
          p={1}
          mr={2}
          w="full"
        >
          <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
              {Object.entries({ channels, conversations })?.map(([c, v], i) => (
                <AutoCompleteGroup key={i} showDivider>
                  <AutoCompleteGroupTitle
                    textTransform="capitalize"
                    color="white"
                    fontSize="15px"
                    fontWeight="semibold"
                  >
                    {c === "channels" ? "Channels" : "Direct Messages"}
                  </AutoCompleteGroupTitle>
                  {v?.map((data, i) => (
                    <AutoCompleteItem
                      key={i}
                      value={
                        c === "channels"
                          ? data.name
                          : data?.name.filter(
                              (name) => name != currentUser?.name
                            )[0]
                      }
                      textTransform="capitalize"
                      bg="transparent"
                      // boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
                      // backdropFilter={"blur(20px)"}
                      // bgImage={`url('src/assets/img/BlackNoise.png')`}
                      // bgSize="cover"
                      // bgRepeat="no-repeat"
                      borderRadius={5}
                      my={1}
                      _hover={{
                        bg: "pong_bg.500",
                      }}
                      _focus={{
                        // bg: "pong_bg.300",
                        backgroundColor: "transparent",
                      }}
                      _selected={{
                        // bg: "pong_bg.300",
                        backgroundColor: "transparent",
                      }}
                    >
                      <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                        w="full"
                        key={data.id}
                      >
                        <Flex
                          direction="row"
                          gap="3px"
                          align="center"
                          w={"full"}
                          onClick={() => {
                            c === "channels"
                              ? navigate(`/chat/channel/${data.name}`)
                              : navigate(`/chat/conversation/${data.id}`);
                          }}
                        >
                          {/* <Avatar
                        size="sm"
                        name={data.name}
                        src={data.avatar}
                        borderColor={"green.400"}
                        borderWidth="2px"
                      >
                        <AvatarBadge
                          boxSize="0.9em"
                          border="1px solid white"
                          bg={"green.400"}
                        />
                      </Avatar> */}
                          <Text
                            color="whiteAlpha.800"
                            fontSize="14px"
                            fontWeight="medium"
                            ml={2}
                            flex={1}
                          >
                            {c === "channels"
                              ? data.name
                              : data?.name.filter(
                                  (name) => name != currentUser?.name
                                )[0]}
                          </Text>
                        </Flex>
                      </Flex>
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteGroup>
              ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="ScrollAreaScrollbar"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="ScrollAreaThumb" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar
              className="ScrollAreaScrollbar"
              orientation="horizontal"
            >
              <ScrollArea.Thumb className="ScrollAreaThumb" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="ScrollAreaCorner" />
          </ScrollArea.Root>
        </AutoCompleteList>
      </AutoComplete>
    </Flex>
  );
};

export default SearchDMsChannels;
