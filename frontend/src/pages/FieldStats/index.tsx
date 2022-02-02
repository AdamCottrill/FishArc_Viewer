import { useEffect } from "react";
import { useQuery } from "react-query";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  HStack,
  VStack,
  Heading,
} from "@chakra-ui/react";

import {
  useAppSelector,
  useAppDispatch,
  useCustomSearchParams,
} from "../../store/hooks";
import { update } from "../../store/slices/FieldStatsSlice";

import { getFieldStats } from "../../services/api";

import { Spinner } from "../../components/Spinner";
import StatsSideBar from "./StatsSideBar";
import ShowFieldStats from "./ShowFieldStats";

export function FieldStats() {
  let [searchAsObject, setSearch] = useCustomSearchParams();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(update(searchAsObject));
  }, []);

  const selected = useAppSelector((state) => state.FieldStats);

  let { field, table, projectType } = selected;

  let queryEnabled = (field && field !== null) === true;

  const { data, error, isFetching } = useQuery(
    ["field-stats", projectType, table, field],
    () => getFieldStats(projectType, table, field),
    {
      enabled: queryEnabled,
    }
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

  //update the url query search parameters each time the filters change
  useEffect(() => {
    setSearch({ ...selected });
  }, [selected]);

  //const spinnerMessage = `Fetching Data for "${field}" from the ${table} table`;

  return (
    <HStack align="top" spacing="30px" flex="1">
      <Flex width="250px">
        <StatsSideBar />
      </Flex>
      <Box flex="1">
        {field ? (
          isFetching ? (
            <Spinner />
          ) : (
            <ShowFieldStats data={data} field={field} table={table} />
          )
        ) : (
          <Flex align="center" border="1px" p={25} borderRadius={15} m={10}>
            <VStack flex="1">
              <Heading as="h2" size="md">
                Select A Field
              </Heading>
              <Flex pt={4}>
                Select a field from the menu on the left to see a summary of how
                and when that field has been used in the {table} table of{" "}
                {projectType} projects.
              </Flex>
            </VStack>
          </Flex>
        )}
      </Box>
    </HStack>
  );
}
