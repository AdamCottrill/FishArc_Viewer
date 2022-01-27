import { FC, useMemo } from "react";
import { Container, Heading } from "@chakra-ui/react";
import SortableTable from "../../components/SortableTable";

export const FN028 = ({ data }): FC => {
  const columns = useMemo(
    () => [
      {
        Header: "Mode",
        accessor: "MODE",
      },

      {
        Header: "Description",
        accessor: "MODE_DES",
      },

      {
        Header: "Gear",
        accessor: "GR",
      },

      {
        Header: "Gear Use",
        accessor: "GRUSE",
      },
      {
        Header: "Orient",
        accessor: "ORIENT",
      },

      {
        Header: "Gear Type",
        accessor: "GRTP",
      },

      {
        Header: "Activity Unit",
        accessor: "ATYUNIT",
      },

      {
        Header: "Interview Unit",
        accessor: "ITVUNIT",
      },

      {
        Header: "Check Flag",
        accessor: "CHKFLAG",
      },
    ],
    []
  );

  return (
    <Container py={2} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        Fishing Modes (FN028)
      </Heading>
      {data.length ? (
        <SortableTable columns={columns} data={data} />
      ) : (
        <p>No Fishing Modes Defined</p>
      )}
    </Container>
  );
};
