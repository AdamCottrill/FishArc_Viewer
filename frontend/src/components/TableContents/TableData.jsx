import React, { useContext } from 'react';
import { useQuery } from 'react-query';

import { getTableData } from '../../services/api';
import SortableTable from './SortableTable';

import { FieldsContext } from '../../contexts/FieldsContext';
import { FiltersContext } from '../../contexts/FiltersContext';
import MySpinner from '../MySpinner';
import { filters2args } from '../../utils';

const TableData = ({ projectType, selectedTable }) => {
  const { excludedFields } = useContext(FieldsContext);
  const { filters } = useContext(FiltersContext);
  //field constians => {}

  const args = filters2args(filters);

  const { data, error, isLoading, isFetching } = useQuery(
    ['table-data', projectType, selectedTable, args],
    () => getTableData(projectType, selectedTable, args)
  );

  const makeColumns = (row) => {
    if (typeof row === 'undefined') {
      return '';
    }
    const columns = Object.keys(data.data[0])
      .filter((x) => !excludedFields.includes(x))
      .map((x) => ({
        Header: x,
        accessor: x,
        Cell: (props) => (props.value ? props.value : '--'),
      }));

    return columns;
  };

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading || isFetching) {
    const spinnerMessage = `Fetching Records from [${selectedTable}]`;
    return <MySpinner message={spinnerMessage} />;
  }

  if (data.data.length === 0) {
    return <div>Ooops! No records meet those criteria.</div>;
  }

  const columns = makeColumns(data.data[0]);

  return <>{data && <SortableTable columns={columns} data={data.data} />}</>;
};

export default TableData;
