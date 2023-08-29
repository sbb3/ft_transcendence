import { extendTheme } from "@chakra-ui/react";

// const Color = require('color');

// const lighten = (clr, value) => Color(clr).lighten(value).hex().toString();
// const darken = (clr, value) => Color(clr).darken(value).hex().toString();

const theme = extendTheme({
  //   colors: {
  //     brand: {
  //       100: "#15e626",
  //       // ...
  //       900: "#1a202c",
  //     },
  //   },
  components: {
    Link: {
      variants: {
        custom: {
          textDecoration: "none !important",
          color: "red",
        },
      },
	  baseStyle: {
		textDecoration: "none !important",
		// color: "red",
	  },
    },
  },
  fonts: {
    heading: `'Poppins', "Nunito", sans-serif`,
    body: `'Poppins', "Nunito", sans-serif`,
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        // bg: "red.400",
        // color: "blue",
        fontFamily: `"Poppins", "Nunito", sans-serif`,
        m: 0,
        boxSizing: "border-box",
        textDecoration: "none",
      },
      html: {
        fontFamily: `"Poppins", "Nunito", sans-serif`,
      },
      a: {
        textDecoration: "none",
        color: "red",
        // target: '_blank',
      },
    },
  },
});

export default theme;
