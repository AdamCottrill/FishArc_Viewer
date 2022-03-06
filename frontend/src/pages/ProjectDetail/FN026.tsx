import { FC, useMemo } from "react";
import { Container, Heading } from "@chakra-ui/react";
import SortableTable from "../../components/SortableTable";

export const FN026 = ({ data }): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        Header: "Space",
        accessor: "SPACE",
      },
      {
        Header: "Description",
        accessor: "SPACE_DES",
      },

      {
        Header: "Space Size",
        accessor: "SPACE_SIZ",
      },
      {
        Header: "Space Weight",
        accessor: "SPACE_WT",
      },

      {
        Header: "Site List",
        accessor: "SITE_LST",
      },
      {
        Header: "Area List",
        accessor: "AREA_LST",
      },
      {
        Header: "Area Count",
        accessor: "AREA_CNT",
      },
      {
        Header: "Area Weight",
        accessor: "AREA_WT",
      },
    ],
    []
  );

  return (
    <Container py={2} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        Spaces (FN026)
      </Heading>
      {data.length ? (
        <SortableTable columns={columns} data={data} />
      ) : (
        <p>No Spatial Strata Defined</p>
      )}
    </Container>
  );
};
