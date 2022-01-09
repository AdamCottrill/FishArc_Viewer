import { useQuery } from "react-query";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
} from "@chakra-ui/react";

import { getFN011Filters } from "../services/api";
import { FilterCheckBoxes } from "../components/FilterCheckBoxes";
import { addFilter, popFilter } from "../utils";

export const FN011Sidebar = ({ values, setValues }): JSX.Element => {
  const { data, status } = useQuery("FN011Choices", getFN011Filters);

  const handleCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value, name } = event.currentTarget;
    const checked = values[name] || [];
    if (checked.includes(value)) {
      popFilter(values, setValues, name, value);
    } else {
      addFilter(values, setValues, name, value);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues({
      ...values,
      [event.currentTarget.id]: event.currentTarget.value,
    });

  const handleBlur = function (
    event: React.FocusEvent<HTMLInputElement>
  ): void {
    const { id } = event.currentTarget;
    const value = values[id];
    //dispatch(update({ [id]: value }));
    setValues({ ...values, [id]: value });
  };

  return (
    <div>
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Project Code
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Fisheries Office
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <p>Project code starts with:</p>
                  <FilterCheckBoxes
                    name="fof"
                    items={data?.fof}
                    status={status}
                    filters={values}
                    handleChange={handleCheckBoxChange}
                    showFilterInput={true}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      PRJ_CD Suffix
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <p>Project code ends with:</p>
                  <FilterCheckBoxes
                    name="prj_cd_suffix"
                    items={data?.suffixes}
                    status={status}
                    filters={values}
                    handleChange={handleCheckBoxChange}
                    showFilterInput={true}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      PRJ_CD contains...
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Input
                    placeholder="PRJ_CD contains..."
                    size="xs"
                    id="prj_cd__like"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.prj_cd__like ? values.prj_cd__like : ""}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Project Type
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <FilterCheckBoxes
              name="project_type"
              items={data?.project_types}
              status={status}
              filters={values}
              handleChange={handleCheckBoxChange}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Years
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <FilterCheckBoxes
              name="years"
              items={data?.years}
              status={status}
              filters={values}
              handleChange={handleCheckBoxChange}
              showFilterInput={true}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
