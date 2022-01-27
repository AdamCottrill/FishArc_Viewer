import {
  Flex,
  HStack,
  Heading,
  VStack,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

import { useAppSelector } from "../../store/hooks";

export default function ShowFieldStats(props) {
  const { data } = props;

  const { field: selectedField, table: selectedTable } = useAppSelector(
    (state) => state.FieldStats
  );

  return (
    <Flex mt={10}>
      <VStack flex="1">
        <Flex>
          {data.occurence_count &&
          data.occurence_count.N &&
          data.distinct_values &&
          data.prj_cds ? (
            <Heading as="h3" size="md">
              <strong>"{selectedField}"</strong> appears in{" "}
              {data.occurence_count.N.toLocaleString()} record
              {data.occurence_count.N > 1 && "s"} in {data.prj_cds.N} project
              {data.prj_cds.N > 1 && "s"} and has {data.distinct_values.N}{" "}
              distinct value{data.distinct_values.N > 1 && "s"}.
            </Heading>
          ) : (
            <Heading as="h3" size="md">
              Oops! <strong>"{selectedField}"</strong> does not appear in{" "}
              {selectedTable}! Please double check the selected field:
              selectedField.
            </Heading>
          )}
        </Flex>
        <HStack spacing={10} align="top" width="100%">
          <VStack p={10} flex="1">
            <Heading as="h3" size="md">
              Count by Project Code
            </Heading>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Project Code</Th>
                  <Th>N</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.project_counts &&
                  data.project_counts.map((project) => (
                    <Tr key={project.PRJ_CD}>
                      <Td>{project.PRJ_CD}</Td>
                      <Td>{project.N}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </VStack>
          <VStack p={10} flex="1">
            <Heading as="h3" size="md">
              Count by Value
            </Heading>
            <Table variant="striped" colorScheme="gray">
              <Thead bg="grey.200">
                <Tr>
                  <Th>Value</Th>
                  <Th>N</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.common_values &&
                  data.common_values.map((val) => (
                    <Tr key={val.value}>
                      <Td>{val.value}</Td>
                      <Td>{val.N}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </VStack>
        </HStack>
      </VStack>
    </Flex>
  );
}
