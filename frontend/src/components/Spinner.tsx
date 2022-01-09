import React from "react";
import { Text, Spinner as ChakraSpinner } from "@chakra-ui/react";

export const Spinner = () => (
  <>
    <Text data-testid="spinner-text" fontSize="3xl" p={4}>
      Loading...
    </Text>
    <ChakraSpinner p={4} size="xl" />
  </>
);
