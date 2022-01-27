import { useQuery } from "react-query";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { update } from "../../store/slices/FieldStatsSlice";

import { getTables } from "../../services/api";

import SidebarRadioInput from "../../components/SidebarRadioInput/SidebarRadioInput";

const SideBarTableRadioButtons = (props) => {
  const { table: selectedTable, projectType } = useAppSelector(
    (state) => state.FieldStats
  );
  const dispatch = useAppDispatch();

  const { data, error, isLoading, isFetching } = useQuery(
    ["tableList", projectType],
    () => getTables(projectType)
  );

  const setSelectedTable = (value) => dispatch(update({ table: value }));

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading || isFetching) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <SidebarRadioInput
        name="project-type-radio-buttons"
        placeholder="Filter tables...."
        items={data.tables}
        selectedItem={selectedTable}
        setSelectedItem={setSelectedTable}
      />
    </div>
  );
};

export default SideBarTableRadioButtons;
