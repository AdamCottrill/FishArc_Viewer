import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { useQuery } from "react-query";

import { useCustomSearchParams } from "../../store/hooks";

import { getFoundFields } from "../../services/api";

import { BoxedAlert } from "../../components/BoxedAlert";
import { Spinner } from "../../components/Spinner";
import { FetchFieldStats } from "./FetchFieldStats";
import { CheckBoxGroup } from "../../components/CheckBoxGroup";
import { projectTypes } from "../../utils";

interface FieldFinderFilterInterface {
  projectType?: string[];
  tablename?: string;
  fieldname?: string;
}

export function FieldFinder() {
  //const spinnerMessage = `Fetching Data for "${field}" from the ${table} table`;

  const projTypes = projectTypes.map((x) => {
    const value = x[0];
    const label = `${x[1]}(${x[0]})`;
    return { value, label };
  });

  let [searchAsObject, setSearch] = useCustomSearchParams();

  const [myfilters, setFilters] = useState<FieldFinderFilterInterface>({
    ...searchAsObject,
  });

  const { data, error } = useQuery(["found-fields", myfilters], () =>
    getFoundFields(myfilters)
  );

  if (error) {
    return <BoxedAlert />;
  }

  // update the url query search parameters each time the myfilters change
  useEffect(() => {
    setSearch({ ...myfilters });
  }, [myfilters]);

  const handleCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.currentTarget;
    let checked = myfilters.hasOwnProperty("projectType")
      ? myfilters["projectType"]
      : [];

    if (checked.includes(value)) {
      // remove it from myfilters
      checked = checked.filter((x: string) => x != value);
      if (checked.length) {
        setFilters({ ...myfilters, projectType: checked });
      } else {
        // if there are no more project types selected, remove the project type key
        const updated = { ...myfilters };
        delete updated.projectType;
        setFilters({ ...updated });
      }
    } else {
      // add it to myfilters
      setFilters({ ...myfilters, projectType: [...checked, value] });
    }
  };

  return (
    <VStack align="top" spacing="30px" flex="1">
      <Flex align="center" border="1px" p={25} borderRadius={15} m={10}>
        <VStack flex="1">
          <Heading as="h2" size="md">
            Field Finder
          </Heading>
          <Flex pt={4}>
            Fill in the field name to limit the returned list of fields to those
            that you are interested in finding.You can further reduce the number
            of records by identifying the table (or part of the table name), and
            selecting one or more project types.Click on the chevron to the
            right of the row to see some basic information about the field in
            that table, including the most frequent values reported in the Great
            Lakes Fish Net archives.
          </Flex>
        </VStack>
      </Flex>

      <HStack align="top">
        <Box width="250px">
          <VStack align="left" px={4}>
            <p>Select Project Types</p>

            <CheckBoxGroup
              name="project-types"
              values={projTypes}
              checked={
                myfilters.hasOwnProperty("projectType")
                  ? myfilters["projectType"]
                  : []
              }
              handleCheck={handleCheckBoxChange}
            />
          </VStack>
        </Box>
        <Box flex="1">
          <HStack mx={6} align="center">
            <Spacer />
            <Input
              w="350px"
              data-testid="tablename-filter-input"
              type="text"
              margin={1}
              rounded="full"
              placeholder={"Table name like..."}
              value={
                myfilters.hasOwnProperty("tablename")
                  ? myfilters["tablename"]
                  : ""
              }
              onChange={(e) =>
                setFilters({ ...myfilters, tablename: e.currentTarget.value })
              }
            />
            <Spacer />
            <Input
              w="350px"
              data-testid="fieldname-filter-input"
              type="text"
              margin={1}
              rounded="full"
              placeholder={"Field name like..."}
              value={
                myfilters.hasOwnProperty("fieldname")
                  ? myfilters["fieldname"]
                  : ""
              }
              onChange={(e) =>
                setFilters({ ...myfilters, fieldname: e.currentTarget.value })
              }
            />
            <Spacer />
          </HStack>
          <Container pt={6} maxW="container.lg">
            {data?.data ? (
              <Accordion allowToggle>
                {data.data.map((row, i) => {
                  return (
                    <AccordionItem key={i}>
                      {({ isExpanded }) => (
                        <>
                          <h2>
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                <strong>{row.fieldname}</strong> ({row.src}{" "}
                                projects, {row.tablename} table,
                                {row.records} records)
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            {isExpanded ? (
                              <FetchFieldStats
                                project_type={row.src}
                                table={row.tablename}
                                field={row.fieldname}
                              />
                            ) : null}
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <Spinner />
            )}
          </Container>
        </Box>
      </HStack>
    </VStack>
  );
}
