import { FC, useMemo } from "react";
import { Container, Heading } from "@chakra-ui/react";
import SortableTable from "../components/SortableTable";

export const FN025 = ({ data }): FC => {
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "DATE",
      },
      {
        Header: "Day Type",
        accessor: "DTP",
      },
    ],
    []
  );

  return (
    <Container py={2} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        Exception Dates (FN022)
      </Heading>
      {data.length ? (
        <SortableTable columns={columns} data={data} />
      ) : (
        <p>No Excpetion Dates Defined </p>
      )}
    </Container>
  );
};
