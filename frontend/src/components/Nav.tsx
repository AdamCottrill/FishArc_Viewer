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

import { useAppSelector } from "../store/hooks";

export default function Nav() {
  const { colormode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");

  const source = useAppSelector((state) => state.DataSource);

  return (
    <Flex p={2} mb={6} borderWidth="1px" borderColor="gray.400" bg={bgColor}>
      <HStack spacing={4} px={4}>
        <Link to={`/${source.value}/`}>Projects</Link>
        <Link to={"/field_stats"}>Field Stats</Link>
        <Link to={"/field_finder"}>Field Finder</Link>
      </HStack>

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
