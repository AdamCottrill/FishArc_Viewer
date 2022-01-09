import { Button, HStack } from "@chakra-ui/react";

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import { VscEllipsis } from "react-icons/vsc";

type Props = {
  pageCount: number;
  currentPage: number;
  siblingCount?: number;
  setPage: (page: number) => void;
}; /* use `interface` if exporting so that consumers can extend */

export const Paginator = ({
  pageCount,
  currentPage,
  setPage,
  siblingCount = 1,
}: Props): JSX.Element => {
  //start will always be currentPage - siblingCount

  const buttonCount = Math.min(pageCount, 3 + siblingCount * 2);

  let leftElipsis: boolean = false;
  let rightElipsis: boolean = false;

  if (pageCount <= buttonCount) {
    leftElipsis = false;
    rightElipsis = false;
  } else {
    leftElipsis = currentPage >= buttonCount ? true : false;
    rightElipsis = currentPage <= pageCount - 2 ? true : false;
  }

  const start = Math.max(2, currentPage - siblingCount * 2);
  const end =
    currentPage + siblingCount * 2 > pageCount
      ? pageCount - 1
      : start + siblingCount * 2;

  const range = (start: number, end: number): number[] => {
    let length = end - start - 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  return (
    <HStack>
      <Button
        size="xs"
        variant="ghost"
        rounded="full"
        disabled={currentPage === 1 ? true : false}
        onClick={() => (currentPage > 1 ? setPage(currentPage - 1) : null)}
        aria-label="Go to previous page"
      >
        <BsChevronLeft />
      </Button>

      <Button
        size="xs"
        variant={currentPage === 1 ? "solid" : "ghost"}
        rounded="full"
        onClick={() => setPage(1)}
        aria-label="Go to first page"
      >
        1
      </Button>

      {leftElipsis && <VscEllipsis />}

      {range(start, end).map((page: number) => (
        <Button
          key={page}
          size="xs"
          variant={page === currentPage ? "solid" : "ghost"}
          rounded="full"
          onClick={() => setPage(page)}
          aria-label="Go to page {page}"
        >
          {page}
        </Button>
      ))}

      {rightElipsis && <VscEllipsis />}

      {pageCount > 1 && (
        <>
          <Button
            size="xs"
            variant={pageCount === currentPage ? "solid" : "ghost"}
            rounded="full"
            onClick={() => setPage(pageCount)}
            aria-label="Go to last page"
          >
            {pageCount}
          </Button>

          <Button
            size="xs"
            variant="ghost"
            rounded="full"
            disabled={currentPage === pageCount ? true : false}
            onClick={() =>
              currentPage < pageCount ? setPage(currentPage + 1) : null
            }
            aria-label="Go to next page"
          >
            <BsChevronRight />
          </Button>
        </>
      )}
    </HStack>
  );
};
