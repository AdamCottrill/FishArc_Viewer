import React, { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";
import { Link, Heading, Container } from "@chakra-ui/react";

import { getProjects } from "../services/api";
import MySpinner from "../components/MySpinner";
import SortableTable from "../components/SortableTable";

export function ProjectList() {
  const filters = { prj_cd__like: "_IA" };

  const { data, error, isLoading, isFetching } = useQuery("projects", () =>
    getProjects(filters)
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

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading || isFetching) {
    const spinnerMessage = `Fetching Projects`;
    return <MySpinner message={spinnerMessage} />;
  }

  return (
    <div>
      <Container maxW="container.xl">
        <Heading mb={8} size="xl">
          Project List
        </Heading>
        {data && <SortableTable columns={columns} data={data.data} />}
      </Container>
    </div>
  );
}
