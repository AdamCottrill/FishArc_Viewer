import { FC } from "react";
import {
  Divider,
  Link,
  Spacer,
  Heading,
  Text,
  Container,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";

import { Link as RouterLink } from "react-router-dom";

export const FN011 = ({ project }): FC => (
  <Container pb={4} borderWidth="1px" borderRadius="lg" maxW="container.xl">
    <Heading py={6}>
      {project.PRJ_NM} ({project.PRJ_CD})
    </Heading>
    <Divider />
    <VStack align="stretch">
      <HStack my={4}>
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
        <Spacer />
        <HStack spacing={8} py={4}>
          <Link as={RouterLink} to={`/samples/${project.PRJ_CD}`}>
            <Button size="sm" colorScheme="teal" rounded="full">
              Samples
            </Button>
          </Link>
          <Link as={RouterLink} to={`/catch_counts/${project.PRJ_CD}`}>
            <Button size="sm" colorScheme="green" rounded="full">
              Catch Counts
            </Button>
          </Link>
          <Link as={RouterLink} to={`/biosamples/${project.PRJ_CD}`}>
            <Button size="sm" colorScheme="blue" rounded="full">
              Bio-Samples
            </Button>
          </Link>
        </HStack>
      </HStack>
    </VStack>

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
