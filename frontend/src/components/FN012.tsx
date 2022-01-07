import { FC, useMemo } from "react";
import { Container, Heading } from "@chakra-ui/react";
import SortableTable from "../components/SortableTable";

export const FN012 = ({ data }): FC => {
  const columns = useMemo(
    () => [
      {
        Header: "Species",
        accessor: "SPC",
      },
      {
        Header: "Species Name",
        accessor: "SPC_NM",
      },
      {
        Header: "GRP",
        accessor: "GRP",
      },
      {
        Header: "GRP Desc.",
        accessor: "GRP_DES",
      },

      {
        Header: "SPCMRK",
        accessor: "SPCMRK",
      },

      {
        Header: "SIZSAM",
        accessor: "SIZSAM",
      },
      {
        Header: "SIZINT",
        accessor: "SIZINT",
      },
      {
        Header: "BIOSAM",
        accessor: "BIOSAM",
      },
      {
        Header: "AGEDEC",
        accessor: "AGEDEC",
      },
      {
        Header: "FDSAM",
        accessor: "FDSAM",
      },
    ],
    []
  );

  return (
    <Container py={8} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        Fish Sampling Protocols (FN012)
      </Heading>
      {data.length ? (
        <SortableTable columns={columns} data={data} />
      ) : (
        <p>No Fish Sampling Details Provided </p>
      )}
    </Container>
  );
};
