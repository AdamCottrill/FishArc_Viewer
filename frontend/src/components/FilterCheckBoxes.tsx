import { VStack } from "@chakra-ui/react";
import { CheckBoxGroup } from "./CheckBoxGroup";
import { Spinner } from "./Spinner";
import { BoxedAlert } from "./BoxedAlert";

type FilterCheckBoxesInterface = {
  name: string;
  items: any;
  status: "idle" | "error" | "loading" | "success";
  filters: any;
  handleChange: any;
  showFilterInput?: boolean;
  alertTitle?: string;
  alertDescription?: string;
};

export const FilterCheckBoxes = ({
  name,
  items,
  status,
  filters,
  handleChange,
  showFilterInput,
  alertTitle,
  alertDescription,
}: FilterCheckBoxesInterface) => {
  if (status === "loading") {
    return <Spinner />;
  }

  const title = alertTitle || "Problem Getting Years";
  const description =
    alertDescription ||
    "There was a problem getting the available years. Please try again later.";

  if (status === "error") {
    return <BoxedAlert title={title} description={description} />;
  }

  const checked = filters.hasOwnProperty(name) ? filters[name] : [];

  return (
    <VStack align="left">
      <CheckBoxGroup
        name={name}
        values={items}
        checked={checked}
        handleCheck={handleChange}
        showFilterInput={showFilterInput || false}
      />
    </VStack>
  );
};
