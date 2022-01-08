import { FC, useMemo } from "react";
import { Heading, Link, Container } from "@chakra-ui/react";

import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";

import MySpinner from "../components/MySpinner";
import SortableTable from "../components/SortableTable";
import { getFN123 } from "../services/api";

export const FN123: FC = () => {
  let { prj_cd } = useParams();

  const { data, error, isLoading, isFetching } = useQuery(
    ["fn123", prj_cd],
    () => getFN123(prj_cd)
  );

  const columns = useMemo(
    () => [
      {
        Header: "SAM",
        accessor: "SAM",
      },
      {
        Header: "EFF",
        accessor: "EFF",
      },
      {
        Header: "SPC",
        accessor: "SPC",
      },
      {
        Header: "GRP",
        accessor: "GRP",
      },

      {
        Header: "CATCNT",
        accessor: "CATCNT",
      },

      {
        Header: "BIOCNT",
        accessor: "BIOCNT",
      },

      {
        Header: "RLSCNT",
        accessor: "RLSCNT",
      },

      {
        Header: "MESCNT",
        accessor: "MESCNT",
      },

      {
        Header: "MESWT",
        accessor: "MESWT",
      },

      {
        Header: "MRKCNT",
        accessor: "MRKCNT",
      },

      {
        Header: "COMMENT3",
        accessor: "COMMENT3",
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
        FN123 records (Catch Counts) collected in{" "}
        <Link color="teal.500" as={RouterLink} to={`/project_detail/${prj_cd}`}>
          {prj_cd}
        </Link>{" "}
        (N={data.count})
      </Heading>
      {data.data.length ? (
        <SortableTable columns={columns} data={data.data} />
      ) : (
        <p>It doesn't look like there any FN123 Records</p>
      )}
    </Container>
  );
};
