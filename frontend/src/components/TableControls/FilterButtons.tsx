import { HStack, Button } from "@chakra-ui/react";

import { GrFilter } from "react-icons/gr";

import { flattenFilters } from "../../utils";
import { FilterInterface } from "../../interfaces";

import { FilterButton } from "./FilterButton";

type FilterButtonsProps = {
  filters: FilterInterface;
  onOpen: () => void;
  filterButtonClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const FilterButtons = ({
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
