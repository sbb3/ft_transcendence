import { Box } from '@chakra-ui/react';
import React from 'react';

const Divider = ({ color }) => {
    if (color === 'orange') {
        return (
            <Box
                as="span"
                w="full"
                h="2px"
                background="linear-gradient(270deg, rgba(255, 135, 7, 0) 0%, #FF8707 55.73%, rgba(255, 135, 7, 0) 100%)"
            />
        );
    }
    return (
        <Box
            as="span"
            w="full"
            h="2px"
            background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)"
        />
    );
};

export default Divider;