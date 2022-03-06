import { FC, useMemo } from "react";
import { Container, Heading } from "@chakra-ui/react";
import SortableTable from "../../components/SortableTable";

export const FN022 = ({ data }): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        Header: "Season",
        accessor: "SSN",
      },
      {
        Header: "Description",
        accessor: "SSN_DES",
      },
      {
        Header: "Start Date",
        accessor: "SSN_DATE0",
      },
      {
        Header: "End Date",
        accessor: "SSN_DATE1",
      },
    ],
    []
  );

  return (
    <Container py={2} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        Seasons (FN022)
      </Heading>
      {data.length ? (
        <SortableTable columns={columns} data={data} />
      ) : (
        <p>No Seasonal Strata Defined </p>
      )}
    </Container>
  );
};
