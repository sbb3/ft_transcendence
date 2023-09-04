import useTitle from "src/hooks/useTitle";
import {
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteItem,
	AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import {
	Stack,
	Text,
	InputGroup,
	InputLeftElement,
	Input,
	Avatar,
	Link,
	Box,
	Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import "/src/styles/search.css";

{
	/* rollNavigation: when you reach the end of the list, it will roll back to the top */
}
const Search = () => {
	useTitle("Search");
	// const [options, setOptions] = useState<string[]>([]);
	const [options, setOptions] = useState<{ name: string; image: string }[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [query, setQuery] = useState<string>("");

	const fetchOptions = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("http://localhost:5001/people");
			const data = await response.json();
			console.log('data :', data);
			setOptions(data);
			setIsLoading(false);
		} catch (error) {
			console.log("error :", error);
		}
	};

	useEffect(() => {
		fetchOptions();

	}, []);
	return (
		<Box mt={4}>
			{/* <Button
				bgGradient="linear(to-r, #FF4E50 0%, #F9D423 51%, #FF4E50 100%)"
				margin="10px"
				padding="15px 45px"
				textAlign="center"
				textTransform="capitalize"
				transition="1s"
				bgSize="200% auto"
				color="white"
				boxShadow="0 0 5px #eee"
				borderRadius="10px"
				style={{ textDecoration: "none" }} //remove the underline
				_hover={{
					bgPosition: "right center",
					color: "white",
				}}
			>
				save
			</Button> */}
			<Stack direction={"column"}>
				<AutoComplete rollNavigation
					isLoading={isLoading}
					openOnFocus
					defaultIsOpen={true}
					listAllValuesOnFocus
				>
					<InputGroup mr={4}
					>
						<InputLeftElement
							pointerEvents="none"
							children={<SearchIcon />}
							bg="pong_cl_primary"
							color="white"
							px={2}
							py={1}
							// borderTopLeftRadius="md"
							// borderBottomLeftRadius="md"
							border="1px solid var(--white, #FFF)"

							borderRadius='md'
							cursor="pointer"
						/>
						<AutoCompleteInput
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
							value={query}
							ml={2}
							flex={1}
							variant="filled"
							bg="pong_bg.400"
							type="text"
							color="white"
							placeholder="username or email address"
							_placeholder={{ fontSize: 14, letterSpacing: 0.5, fontWeight: 'light', opacity: 0.7, color: 'gray.500' }}
						/>

					</InputGroup>

					<AutoCompleteList
						bg="pong_bg.400"
						border="1px solid var(--white, #FFF)"
						borderRadius='xl'>
						{
							options.map((option, i) => (
								<Link
									key={i}
									as={RouterLink}
									to={`/profile/${option.name}`}
								>
									<AutoCompleteItem
										key={i}
										value={option}
										textTransform="capitalize"

									>
										<Avatar size="sm" name={option.name} src={option.image} />
										<Text ml={2}>{option.name}</Text>

									</AutoCompleteItem>
								</Link>
							))
						}
					</AutoCompleteList>
				</AutoComplete>
			</Stack >
		</Box >
	);
};

export default Search;
