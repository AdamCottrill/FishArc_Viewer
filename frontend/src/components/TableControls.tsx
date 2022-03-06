import { Box, HStack, Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Paginator } from "./Paginator";

import { GrFilter } from "react-icons/gr";

import { flattenFilters } from "../utils";
import { FilterInterface } from "../interfaces";

type FilterButtonInterface = {
  name: string;
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const FilterButton = ({
  name,
  value,
  onClick,
}: FilterButtonInterface): JSX.Element => (
  <Button
    name={name}
    value={value}
    size="xs"
    colorScheme="teal"
    onClick={onClick}
    rounded="full"
    rightIcon={<DeleteIcon />}
    aria-label="Remove filter for {name} {value}"
  >
    {`${name}=${value}`}
  </Button>
);

type FilterButtonsProps = {
  filters: FilterInterface;
  onOpen: () => void;
  filterButtonClick: React.MouseEventHandler<HTMLButtonElement>;
};

const FilterButtons = ({
  filters,
  onOpen,
  filterButtonClick,
}: FilterButtonsProps): JSX.Element => {
  const flatFilters = flattenFilters(filters);

  return (
    <HStack>
      <Button
        size="xs"
        colorScheme="teal"
        rounded="full"
        variant="outline"
        rightIcon={<GrFilter />}
        onClick={onOpen}
        aria-label="Toggle filter sidebar"
      >
        Filters
      </Button>

      {flatFilters &&
        flatFilters.map(([name, value]) => {
          if (name !== "page" && value !== "" && typeof value !== "undefined") {
            return (
              <FilterButton
                key={`${name}=${value}`}
                name={name}
                value={value}
                onClick={filterButtonClick}
              />
            );
          }
        })}
    </HStack>
  );
};

type Props = {
  filters: FilterInterface;
  pageCount: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  filterButtonClick: React.MouseEventHandler<HTMLButtonElement>;
  drawerOnOpen: () => void;
};

export const TableControls = ({
  filters,
  pageCount,
  currentPage,
  setCurrentPage,
  filterButtonClick,
  drawerOnOpen,
}: Props): JSX.Element => {
  return (
    <Box>
      <HStack p={6} justify="space-between">
        <Box>
          {filters && (
            <FilterButtons
              filters={filters}
              onOpen={drawerOnOpen}
              filterButtonClick={filterButtonClick}
            />
          )}
        </Box>
        <Box>
          <Paginator
            pageCount={pageCount}
            currentPage={currentPage}
            setPage={setCurrentPage}
          />
        </Box>
      </HStack>
    </Box>
  );
};
