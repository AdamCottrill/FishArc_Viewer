import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { useQuery } from "react-query";

import { getFoundFields } from "../../services/api";

import { Spinner } from "../../components/Spinner";
import { FetchFieldStats } from "./FetchFieldStats";

export function FieldFinder() {
  //const spinnerMessage = `Fetching Data for "${field}" from the ${table} table`;

  const [filters, setFilters] = useState({});

  const { data, error, isFetching } = useQuery(["found-fields", filters], () =>
    getFoundFields(filters)
  );

  if (error) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Aw Snap!
        </AlertTitle>
        <AlertDescription maxWidth="sm">Something went wrong!</AlertDescription>
      </Alert>
    );
  }

  return (
    <HStack align="top" spacing="30px" flex="1">
      <Flex width="250px">
        <p>Select Project Types</p>
      </Flex>
      <Box flex="1">
        <Flex align="center" border="1px" p={25} borderRadius={15} m={10}>
          <VStack flex="1">
            <Heading as="h2" size="md">
              Field Finder
            </Heading>
            <Flex pt={4}>
              Fill in the Field name to limit the returned list of fields to
              those that you are interested in finding.You can further reduce
              the number of records by identifying the table (or part of the
              table name), and selecting one or more project types.Click on the
              chevron to the right of the row to see some basic information
              about the field in that table, including the most frequent values
              reported in the Great Lakes Fish Net archives.
            </Flex>
          </VStack>
        </Flex>

        <HStack mx={6} align="center">
          <Spacer />
          <Input
            w="350px"
            data-testid="tablename-filter-input"
            type="text"
            margin={1}
            rounded="full"
            placeholder={"Table name like..."}
            onChange={(e) =>
              setFilters({ ...filters, tablename: e.currentTarget.value })
            }
          />
          <Spacer />
          <Input
            w="350px"
            data-testid="fieldname-filter-input"
            type="text"
            margin={1}
            rounded="full"
            placeholder={"Field name like..."}
            onChange={(e) =>
              setFilters({ ...filters, fieldname: e.currentTarget.value })
            }
          />
          <Spacer />
        </HStack>
        <Container pt={6} maxW="container.lg">
          {data?.data ? (
            <Accordion allowToggle>
              {data.data.map((row, i) => {
                return (
                  <AccordionItem key={i}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <strong>{row.fieldname}</strong> ({row.src}{" "}
                              projects, {row.tablename} table,
                              {row.records} records)
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          {isExpanded ? (
                            <FetchFieldStats
                              project_type={row.src}
                              table={row.tablename}
                              field={row.fieldname}
                            />
                          ) : null}
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <Spinner />
          )}
        </Container>
      </Box>
    </HStack>
  );
}
