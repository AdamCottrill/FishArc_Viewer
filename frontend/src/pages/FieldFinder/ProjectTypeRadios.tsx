import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { update } from "../../store/slices/FieldStatsSlice";

import { Flex, RadioGroup, Radio, Stack } from "@chakra-ui/react";

import { projectTypes } from "../../utils";

const ProjectTypeRadios = (props) => {
  const { projectType } = useAppSelector((state) => state.FieldStats);
  const dispatch = useAppDispatch();

  const handleChange = (value) => {
    dispatch(update({ projectType: value }));
  };

  return (
    <Flex>
      <RadioGroup
        name="project-type-radio-buttons"
        defaultValue={projectType}
        onChange={handleChange}
      >
        <Stack px={2}>
          {projectTypes.map(([ptype, label]) => (
            <Radio size="sm" key={ptype} value={ptype}>
              {label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Flex>
  );
};

export default SideBarProjectType;
