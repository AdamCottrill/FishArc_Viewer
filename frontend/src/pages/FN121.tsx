import { FC, useMemo } from "react";
import { Heading, Link, Container } from "@chakra-ui/react";

import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";

import MySpinner from "../components/MySpinner";
import SortableTable from "../components/SortableTable";
import { getFN121 } from "../services/api";

export const FN121: FC = () => {
  let { prj_cd } = useParams();

  const { data, error, isLoading, isFetching } = useQuery(
    ["fn121", prj_cd],
    () => getFN121(prj_cd)
  );

  const columns = useMemo(
    () => [
      {
        Header: "SAM",
        accessor: "SAM",
      },
      {
        Header: "EFFDT0",
        accessor: "EFFDT0",
      },
      {
        Header: "EFFDT1",
        accessor: "EFFDT1",
      },
      {
        Header: "DATE",
        accessor: "DATE",
      },

      {
        Header: "EFFTM0",
        accessor: "EFFTM0",
      },

      {
        Header: "EFFTM1",
        accessor: "EFFTM1",
      },

      {
        Header: "EFFTDUR",
        accessor: "EFFDUR",
      },

      {
        Header: "GRTP",
        accessor: "GRTP",
      },

      {
        Header: "GR",
        accessor: "GR",
      },

      {
        Header: "SITE",
        accessor: "SITE",
      },

      {
        Header: "AREA",
        accessor: "AREA",
      },

      {
        Header: "GRID",
        accessor: "GRID",
      },

      {
        Header: "MODE",
        accessor: "MODE",
      },

      {
        Header: "COMMENT0",
        accessor: "COMMENT0",
      },
    ],
    []
  );

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading || isFetching) {
    const spinnerMessage = `Fetching Samples`;
    return <MySpinner message={spinnerMessage} />;
  }

  return (
    <Container my={4} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        FN121 records (Net Sets or Samples) collected in{" "}
        <Link color="teal.500" as={RouterLink} to={`/project_detail/${prj_cd}`}>
          {prj_cd}
        </Link>{" "}
        (N={data.count})
      </Heading>
      {data.data.length ? (
        <SortableTable columns={columns} data={data.data} />
      ) : (
        <p>It doesn't look like there any FN121 Records</p>
      )}
    </Container>
  );
};
