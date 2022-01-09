import { FC, useMemo, useState } from "react";
import { Heading, Container, Link, useDisclosure } from "@chakra-ui/react";

import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";

import SortableTable from "../components/SortableTable";
import MySpinner from "../components/MySpinner";
import { Fn125Sidebar } from "../components/FN125Sidebar";
import TableControls from "../components/TableControls";
import { FilterDrawer } from "./components/FilterDrawer";
import { getFN125 } from "../services/api";

export const FN125: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recordCount, setRecordCount] = useState(0);

  let { prj_cd } = useParams();

  const { data, error, isLoading, isFetching } = useQuery(
    ["fn125", prj_cd],
    () => getFN125(prj_cd)
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
        Header: "FISH",
        accessor: "FISH",
      },

      {
        Header: "FLEN",
        accessor: "FLEN",
      },

      {
        Header: "TLEN",
        accessor: "TLEN",
      },

      {
        Header: "RWT",
        accessor: "RWT",
      },

      {
        Header: "SEX",
        accessor: "SEX",
      },

      {
        Header: "MAT",
        accessor: "MAT",
      },

      {
        Header: "GON",
        accessor: "GON",
      },

      {
        Header: "AGE",
        accessor: "AGE",
      },

      {
        Header: "AGEST",
        accessor: "AGEST",
      },

      {
        Header: "TISSUE",
        accessor: "TISSUE",
      },

      {
        Header: "TAGID",
        accessor: "TAGID",
      },

      {
        Header: "TAGDOC",
        accessor: "TAGDOC",
      },

      {
        Header: "TAGSTAT",
        accessor: "TAGSTAT",
      },

      {
        Header: "COMMENT5",
        accessor: "COMMENT5",
      },
    ],
    []
  );

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading || isFetching) {
    const spinnerMessage = `Fetching Bio-Data`;
    return <MySpinner message={spinnerMessage} />;
  }

  return (
    <Container my={4} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        FN125 records (Biological Samples) collected in{" "}
        <Link color="teal.500" as={RouterLink} to={`/project_detail/${prj_cd}`}>
          {prj_cd}
        </Link>{" "}
        (N={data.count})
      </Heading>
      {data.data.length ? (
        <SortableTable columns={columns} data={data.data} />
      ) : (
        <p>It doesn't look like there any FN125 Records</p>
      )}
    </Container>
  );
};
