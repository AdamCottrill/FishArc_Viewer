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

const base_url = import.meta.env.BASE_URL;

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");

  const source = useAppSelector((state) => state.DataSource);

  return (
    <Flex p={2} mb={6} borderWidth="1px" borderColor="gray.400" bg={bgColor}>
      <HStack spacing={4} px={4}>
        <Link to={`${base_url}${source.value}/`}>Projects</Link>
        <Link to={`${base_url}field_stats`}>Field Stats</Link>
        <Link to={`${base_url}field_finder`}>Field Finder</Link>
      </HStack>

      <Spacer />
      <IconButton
        rounded="full"
        variant="ghost"
        aria-label="toggle-color-theme"
        onClick={() => toggleColorMode()}
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      />
    </Flex>
  );
}
