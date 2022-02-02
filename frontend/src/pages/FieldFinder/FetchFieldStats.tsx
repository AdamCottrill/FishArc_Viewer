import { useQuery } from "react-query";

import ShowFieldStats from "../FieldStats/ShowFieldStats";

import { getFieldStats } from "../../services/api";
import { Spinner } from "../../components/Spinner";

export function FetchFieldStats(props) {
  const { project_type, field, table } = props;

  const { data, error, isFetching } = useQuery(
    ["field-stats", project_type, table, field],
    () => getFieldStats(project_type, table, field)
  );

  if (error) {
    return <p>Something went wrong!</p>;
  }

  return (
    <>
      {isFetching ? (
        <Spinner />
      ) : (
        <ShowFieldStats data={data} table={table} field={field} />
      )}
    </>
  );
}
