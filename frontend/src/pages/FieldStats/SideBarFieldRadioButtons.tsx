import { useQuery } from "react-query";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { update } from "../../store/slices/FieldStatsSlice";

import { getTableFields } from "../../services/api";
import SidebarRadioInput from "../../components/SidebarRadioInput/SidebarRadioInput";

const SideBarFieldRadioButtons = (props) => {
  // when the selectedTable changes - update the list of fields in state

  const {
    field: selectedField,
    table: selectedTable,
    projectType,
  } = useAppSelector((state) => state.FieldStats);
  const dispatch = useAppDispatch();

  const { data, error, isLoading, isFetching } = useQuery(
    ["getTableFields", projectType, selectedTable],
    () => getTableFields(projectType, selectedTable)
  );

  //const setSelectedField = (value) => setSelected("field", value);

  const setSelectedField = (value) => dispatch(update({ field: value }));

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading || isFetching) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <SidebarRadioInput
        name="field-radio-buttons"
        items={data.fields}
        selectedItem={selectedField}
        setSelectedItem={setSelectedField}
      />
    </div>
  );
};

export default SideBarFieldRadioButtons;
