import { FC } from "react";
import { Container } from "@chakra-ui/react";

export const FN024 = ({ data }): FC => (
  <Container maxW="container.xl">{JSON.stringify(data, null, 2)}</Container>
);
