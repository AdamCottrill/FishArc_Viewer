import { FC, useMemo, useEffect, useState } from "react";
import { Heading, Container, Link, useDisclosure } from "@chakra-ui/react";

import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";

import SortableTable from "../components/SortableTable";
import Spinner from "../components/MySpinner";
import { FN125Sidebar } from "../components/FN125Sidebar";
import { TableControls } from "../components/TableControls";
//import { FilterDrawer } from "./components/FilterDrawer";
import { get_fn_data } from "../services/api";

import {
  useAppSelector,
  useAppDispatch,
  useCustomSearchParams,
} from "../store/hooks";
import { update, remove } from "../store/slices/FN125ListFilterSlice";

export const FN125: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recordCount, setRecordCount] = useState(0);
  let [searchAsObject, setSearch] = useCustomSearchParams();

  const filters = useAppSelector((state) => state.FN125List);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(update(searchAsObject));
  }, []);

  // update the url query search parameters each time the filters change
  useEffect(() => {
    setSearch(filters);
  }, [filters]);

  /* Pagination*/
  const perPage = 100;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    appDispatch(update({ page: currentPage }));
  }, [currentPage]);

  const filterButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const { name, value } = e.currentTarget;
    appDispatch(remove({ [name]: value }));
  };

  let { source, prj_cd } = useParams();

  const { data, error, isLoading, isFetching } = useQuery(
    ["fn125", source, prj_cd, filters],
    () => get_fn_data(source, prj_cd, "fn125", filters)
  );

  const columns = useMemo(
    () => [
      {
        Header: "SAM",
        accessor: "SAM",
      },
      {
        Header: "STRATUM",
        accessor: "STRATUM",
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

  useEffect(() => {
    if (data) {
      setRecordCount(data.count);
      setPageCount(Math.ceil(data.count / perPage));
    } else {
      setPageCount(1);
      setRecordCount(0);
    }
  }, [data, perPage, recordCount, setRecordCount]);

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading || isFetching) {
    const spinnerMessage = `Fetching Bio-Data`;
    return <Spinner message={spinnerMessage} />;
  }

  const nobs = data.count ? data.count.toLocaleString() : 0;

  return (
    <Container my={4} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        FN125 records (Biological Samples) collected in{" "}
        <Link
          color="teal.500"
          as={RouterLink}
          to={`/${source}/project_detail/${prj_cd}`}
        >
          {prj_cd}
        </Link>{" "}
        (N={nobs})
      </Heading>

      <TableControls
        filters={filters}
        pageCount={pageCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        filterButtonClick={filterButtonClick}
        drawerOnOpen={onOpen}
      />

      {data.data.length ? (
        <SortableTable columns={columns} data={data.data} />
      ) : (
        <p>It doesn't look like there any FN125 Records</p>
      )}

      <FN125Sidebar isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};
