import { FC, useMemo, useEffect, useState } from "react";
import { Heading, Container, Link, useDisclosure } from "@chakra-ui/react";

import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";

import SortableTable from "../../components/SortableTable";
import Spinner from "../../components/MySpinner";
import { TableControls } from "../../components/TableControls";
import { get_fn_data } from "../../services/api";

import {
  useAppSelector,
  useAppDispatch,
  useCustomSearchParams,
} from "../../store/hooks";
import { update, remove } from "../../store/slices/FN121ListFilterSlice";

import { FN121Sidebar } from "./FN121Sidebar";

const base_url = import.meta.env.BASE_URL;

export default function FN121() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recordCount, setRecordCount] = useState(0);
  let [searchAsObject, setSearch] = useCustomSearchParams();

  const filters = useAppSelector((state) => state.FN121List);
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
    ["fn121", source, prj_cd, filters],
    () => get_fn_data(source, prj_cd, "fn121", filters)
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
        Header: "EFFDUR",
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
    const spinnerMessage = `Fetching Samples`;
    return <Spinner message={spinnerMessage} />;
  }

  const nobs = data.count ? data.count.toLocaleString() : 0;

  return (
    <Container my={4} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        FN121 records (Net Sets or Samples) collected in{" "}
        <Link
          color="teal.500"
          as={RouterLink}
          to={`${base_url}${source}/project_detail/${prj_cd}`}
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

      {data.data ? (
        <SortableTable columns={columns} data={data.data} />
      ) : (
        <p>It doesn't look like there any FN121 Records</p>
      )}
      <FN121Sidebar isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}
