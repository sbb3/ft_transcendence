import { Box, Button, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, } from "@chakra-ui/react";
import { IoNotificationsSharp } from "react-icons/io5";
import { css } from '@emotion/react';
import { FaBell } from 'react-icons/fa';
import { ChevronDownIcon } from "@chakra-ui/icons";


function Notification({ count }: { count: number }) {
	return (

		<Menu>
			<MenuButton as={IconButton}
				css={css`
				position: relative !important;
			  `}
				py={'2'}
				colorScheme={'gray'}
				aria-label={'Notifications'}
				size='md' fontSize="lg" bg={'pong_cl_primary'}
				color={'white'} borderRadius={'50%'}
				icon={<>
					<FaBell color={'gray.750'} />
					{/* TODO: animate the bell, when new notification is in */}
					<Box as={'span'} color={'pong_bg_third'} position={'absolute'} top={'3px'} right={'6px'} fontSize={'0.7rem'}
						zIndex={9999} p={'1px'}

					>
						{count}
					</Box>
				</>}
				_hover={{
					bg: "white",
					color: "pong_cl_primary",
				}}

			/>
			<MenuList color={'#312244'} fontSize={'sm'}
				zIndex={1}
			>
				<MenuItem bg={'red'} minH='48px' color={'#312244'} fontWeight={'bold'} fontSize={'sm'}>
					<Image
						boxSize='2rem'
						borderRadius='full'
						src='https://placekitten.com/100/100'
						alt='Fluffybuns the destroyer'
						mr='12px'
					/>
					<span>Fluffybuns the Destroyer</span>
				</MenuItem>
				<MenuItem minH='40px' bg={'yellow'}>
					<Image
						boxSize='2rem'
						borderRadius='full'
						src='https://placekitten.com/120/120'
						alt='Simon the pensive'
						mr='12px'
					/>
					<span>Simon the pensive</span>
				</MenuItem>
			</MenuList>
		</Menu >
	);
}

function Notifications() {
	return (
		<Box
			position="relative"

		>
			<Notification count={3} />

		</Box>
	);
}

export default Notifications;
