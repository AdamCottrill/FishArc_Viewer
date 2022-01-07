import React from "react";
import { Link } from "react-router-dom";

import {
  Flex,
  IconButton,
  Spacer,
  useColorMode,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import NabBarSearch from "./NabBarSearch";

export default function Nav() {
  const { colormode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  return (
    <Flex p={2} mb={6} borderWidth="1px" borderColor="gray.400" bg={bgColor}>
      <HStack spacing={4} px={4}>
        <Link to="/">Projects</Link>
      </HStack>
      <Spacer />
      <Flex>
        <NabBarSearch />
      </Flex>
      <Spacer />
      <IconButton
        rounded="full"
        variant="ghost"
        aria-label="toggle-color-theme"
        onClick={() => toggleColorMode()}
        icon={colormode === "light" ? <MoonIcon /> : <SunIcon />}
      />
    </Flex>
  );
}
