import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Link,
  Heading,
  Container,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";

import { getProjects } from "../services/api";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { update, remove } from "../store/slices/FN011ListFilterSlice";

import MySpinner from "../components/MySpinner";
import SortableTable from "../components/SortableTable";

import { FN011Sidebar } from "../components/FN011Sidebar";
import { TableControls } from "../components/TableControls";
import { FilterDrawer } from "../components/FilterDrawer";

export function FN011List() {
  const filters = useAppSelector((state) => state.FN011List);
  const dispatch = useAppDispatch();

  const [values, setValues] = useState({ ...filters });

  useEffect(() => {
    setValues({ ...filters });
  }, [filters]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recordCount, setRecordCount] = useState(0);

  /* Pagination*/
  const perPage = 100;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    dispatch(update({ page: currentPage }));
  }, [currentPage]);

  const filterButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const { name, value } = e.currentTarget;
    dispatch(remove({ [name]: value }));
  };

  const { data, error, isLoading, isFetching } = useQuery(
    ["projects", filters],
    () => getProjects(filters)
  );

  const columns = useMemo(
    () => [
      {
        Header: "Project Code",
        accessor: "PRJ_CD",
        Cell: ({ row }) => {
          const { PRJ_CD } = row.values;

          return (
            <Link
              as={RouterLink}
              color="blue"
              to={{ pathname: `/project_detail/${PRJ_CD}` }}
            >
              {PRJ_CD}
            </Link>
          );
        },
      },
      {
        Header: "Project Name",
        accessor: "PRJ_NM",
      },
      {
        Header: "Project Lead",
        accessor: "PRJ_LDR",
      },
      {
        Header: "Start Date",
        accessor: "PRJ_DATE0",
      },
      {
        Header: "End Date",
        accessor: "PRJ_DATE1",
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
    const spinnerMessage = `Fetching Projects`;
    return <MySpinner message={spinnerMessage} />;
  }

  const applyClick = () => {
    dispatch(update(values));
    onClose();
  };

  const nobs = data.count ? data.count.toLocaleString() : 0;

  return (
    <div>
      <Container maxW="container.xl">
        <Heading size="xl">Project List (N={nobs})</Heading>

        <TableControls
          filters={filters}
          pageCount={pageCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          filterButtonClick={filterButtonClick}
          drawerOnOpen={onOpen}
        />

        {data && <SortableTable columns={columns} data={data.data} />}
      </Container>
      <FilterDrawer isOpen={isOpen} onClose={onClose} applyClick={applyClick}>
        <FN011Sidebar values={values} setValues={setValues} />
      </FilterDrawer>
    </div>
  );
}
