import { Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

type FilterButtonInterface = {
  name: string;
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const FilterButton = ({
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
    aria-label={`Remove filter for ${name} ${value}`}
  >
    {`${name}=${value}`}
  </Button>
);
