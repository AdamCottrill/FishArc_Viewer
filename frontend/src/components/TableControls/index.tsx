import { Box, HStack } from "@chakra-ui/react";
import { Paginator } from "../Paginator";

import { FilterInterface } from "../../interfaces";

import { FilterButtons } from "./FilterButtons";

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
