import { FC } from "react";
import {
  Divider,
  Flex,
  Spacer,
  Heading,
  Text,
  Container,
} from "@chakra-ui/react";

export const FN011 = ({ project }): FC => (
  <Container maxW="container.xl">
    <Heading py={6}>
      {project.PRJ_NM} ({project.PRJ_CD})
    </Heading>
    <Divider />
    <Flex my={4}>
      <Text fontSize="xl">
        <strong>Project Lead:</strong>{" "}
        <span style={{ textTransform: "capitalize" }}>
          {project.PRJ_LDR ? project.PRJ_LDR.toLowerCase() : ""}
        </span>
      </Text>
      <Spacer />
      <Text fontSize="xl">
        <strong>Start Date:</strong> {project.PRJ_DATE0}
      </Text>
      <Spacer />
      <Text fontSize="xl">
        <strong>Start End:</strong> {project.PRJ_DATE1}
      </Text>
    </Flex>
    <Divider />
    <Text my={4} align="left" fontSize="lg">
      <strong>Description:</strong>
    </Text>
    {project.COMMENT0 ? (
      <Text align="left">{project.COMMENT0}</Text>
    ) : (
      <Text align="left">No Description Provided.</Text>
    )}
  </Container>
);
