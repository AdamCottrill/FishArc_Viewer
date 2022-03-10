import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  HStack,
  Heading,
  Link,
  VStack,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const base_url = import.meta.env.BASE_URL;

export default function ShowFieldStats(props) {
  const { data, field, table } = props;

  return (
    <Flex mt={10}>
      <VStack flex="1">
        <Flex>
          {data.occurence_count &&
          data.occurence_count.N &&
          data.distinct_values &&
          data.prj_cds ? (
            <Heading as="h3" size="md">
              <strong>"{field}"</strong> appears in{" "}
              {data.occurence_count.N.toLocaleString()} record
              {data.occurence_count.N > 1 && "s"} in the {table} table.
              <br />
              It is associated with {data.prj_cds.N} project
              {data.prj_cds.N > 1 && "s"} and has {data.distinct_values.N}{" "}
              distinct value
              {data.distinct_values.N > 1 && "s"}.
            </Heading>
          ) : (
            <Heading as="h3" size="md">
              Oops! <strong>"{field}"</strong> does not appear in {table}!
              Please double check the table and selected field.
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
                    <Tr
                      key={
                        project.PRJ_CD ||
                        (Math.random() + 1).toString(36).substring(7)
                      }
                    >
                      <Td>
                        <Link
                          color="teal.500"
                          as={RouterLink}
                          to={`${base_url}glarc/project_detail/${project.PRJ_CD}`}
                        >
                          {project.PRJ_CD}
                        </Link>
                      </Td>
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
                    <Tr
                      key={
                        val.value ||
                        (Math.random() + 1).toString(36).substring(7)
                      }
                    >
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
