import { useState, useReducer } from "react";
import { useQuery } from "react-query";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  Drawer,
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { update } from "../../store/slices/FN011ListFilterSlice";

import { getFN011Filters } from "../../services/api";
import { FilterCheckBoxes } from "../../components/FilterCheckBoxes";
import reducer from "../../components/SideBarReducer";

export const FN011Sidebar = ({ isOpen, onClose }): JSX.Element => {
  const { source } = useParams();

  const { data, status } = useQuery(["FN011Choices", source], () =>
    getFN011Filters(source)
  );

  const filters = useAppSelector((state) => state.FN011List);
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

  const handleBlur = function (
    event: React.FocusEvent<HTMLInputElement>
  ): void {
    const { id, value } = event.currentTarget;
    dispatch({ type: "update", payload: { [id]: value } });
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
                            PRJ_CD Suffix
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <p>Project code ends with:</p>
                        <FilterCheckBoxes
                          name="prj_cd_suffix"
                          items={data?.prj_cd_suffix}
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
                          onBlur={handleBlur}
                          defaultValue={state?.prj_cd__like || ""}
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
                    items={data?.project_type}
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
                      PRJ_NM like...
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <p></p>
                  <Input
                    placeholder="PRJ_NM like..."
                    size="xs"
                    id="prj_nm__like"
                    onBlur={handleBlur}
                    defaultValue={state?.prj_nm__like || ""}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      PRJ_LDR like...
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Input
                    placeholder="PRJ_LDR contains..."
                    size="xs"
                    id="prj_ldr__like"
                    onBlur={handleBlur}
                    defaultValue={state?.prj_ldr__like || ""}
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
