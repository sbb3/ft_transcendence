import { defineStyleConfig, extendTheme } from "@chakra-ui/react";
import Color from "color";

// const lighten = (clr, value) => Color(clr).lighten(value).hex().toString();
// const darken = (clr, value) => Color(clr).darken(value).hex().toString();


const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    color: 'blackAlpha.900',
    bg: '#FF9100',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: 'base', // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: 'md',
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: '2px solid',
      borderColor: 'purple.500',
      color: 'purple.500',
    },
    solid: {
      bg: 'purple.500',
      color: 'white',
    },
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
})

const theme = extendTheme({
  colors: {
    pong_bg_primary: "#333333",
    pong_bg_secondary: "#454545",
    pong_bg_third: "#535353",
    pong_bg_fourth: "#5A5A5A",
    pong_bg: {
      100: "#333333",
      200: "#454545",
      300: "#535353",
      400: "#5A5A5A",
      500: "#676767",
      600: "#808080",
      700: "#939393",
      800: "#E0E0E0",
    },
    pong_cl_primary: "#FF8707",
    pong_cl: {
      100: "#FB6613",
      200: "#FF6D00",
      300: "#FF7900",
      400: "#FF7F00",
      500: "#FF8707",
      600: "#FF9100",
      700: "#FFA000",
    },
  },
  components: {
    Link: {
      variants: {
        custom: {
          textDecoration: "none !important",
        },
      },
      baseStyle: {
        textDecoration: "none !important",
      },
    },
    // Button,
  },
  fonts: {
    heading: `'Montserrat', "Poppins", sans-serif`,
    body: `'Montserrat', "Poppins", sans-serif`,
  },
  styles: {
    global: {
      html: {
        height: "100%",
        m: 0,
        p: 0,
        fontFamily: `'Montserrat', "Poppins", sans-serif`,
      },
      body: {
        display: "flex",
        direction: "row",
        justifyContent: "center",
        alignItems: "center",
        overflow: "0 auto",
        // height: "100vh",
        // width: "100vw",
        position: "relative",
        margin: 0,
        paddng: 0,
        boxSizing: "border-box",
        bg: "pong_bg_primary",
        color: "whiteAlpha.900",
        fontFamily: `'Montserrat', "Poppins", sans-serif`,
        textDecoration: "none",
      },
      a: {
        textDecoration: "none",
        // target: '_blank',
      },
    },
  },
});

export default theme;
