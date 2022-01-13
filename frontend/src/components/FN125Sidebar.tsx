import { useReducer } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Drawer,
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { update } from "../store/slices/FN125ListFilterSlice";

import { getFN125Filters } from "../services/api";
import { FilterCheckBoxes } from "../components/FilterCheckBoxes";

//import { addFilter, popFilter } from "../utils";
import reducer from "./SideBarReducer";

export const FN125Sidebar = ({ isOpen, onClose }): JSX.Element => {
  let { prj_cd } = useParams();

  const { data, status } = useQuery(["FN125Choices", prj_cd], () =>
    getFN125Filters(prj_cd)
  );

  const filters = useAppSelector((state) => state.FN125List);
  const appDispatch = useAppDispatch();

  const [state, dispatch] = useReducer(reducer, { ...filters });

  const handleCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value, name } = event.currentTarget;
    const checked = state[name] || [];
    if (checked.includes(value)) {
      dispatch({ type: "pop", payload: { [name]: value } });
    } else {
      dispatch({ type: "add", payload: { [name]: value } });
    }
  };

  const applyClick = () => {
    onClose();
    appDispatch(update(state));
  };

  return (
    <Drawer size="sm" isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Refine By:</DrawerHeader>
        <DrawerBody>
          <div>
            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Sample
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FilterCheckBoxes
                    name="sam__in"
                    items={data?.sam}
                    status={status}
                    filters={state}
                    handleChange={handleCheckBoxChange}
                    showFilterInput={true}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Effort
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FilterCheckBoxes
                    name="eff__in"
                    items={data?.eff}
                    status={status}
                    filters={state}
                    handleChange={handleCheckBoxChange}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Group Code
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FilterCheckBoxes
                    name="grp__in"
                    items={data?.grp}
                    status={status}
                    filters={state}
                    handleChange={handleCheckBoxChange}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Species
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FilterCheckBoxes
                    name="spc__in"
                    items={data?.spc}
                    status={status}
                    filters={state}
                    handleChange={handleCheckBoxChange}
                    showFilterInput={true}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button mr={3} onClick={applyClick}>
            Apply
          </Button>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
