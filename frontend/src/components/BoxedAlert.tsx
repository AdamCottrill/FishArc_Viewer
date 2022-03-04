import React from "react";
import {
  Alert,
  AlertIcon,
  AlertStatus,
  AlertTitle,
  AlertDescription,
  Box,
  Center,
} from "@chakra-ui/react";

type Props = {
  title?: string;
  description?: string;
  status?: AlertStatus;
  icon?: React.FC;
  width?: string;
};

export const BoxedAlert = ({
  title,
  description,
  status,
  icon,
  width,
}: Props) => {
  //Uh-oh! Something went wrong.
  const alertDescription =
    description || "Something went wrong. Please try again later.";
  const alertTitle = title || "Something went wrong.";
  const alertStatus = status || "error";
  const alertIcon = icon || <AlertIcon />;
  const alertWidth = width || "60%";

  return (
    <Center p={5}>
      <Box w={alertWidth}>
        <Alert status={alertStatus}>
          {alertIcon}
          <AlertTitle data-testid="alert-title-text" mr={2}>
            {alertTitle}
          </AlertTitle>
          <AlertDescription data-testid="alert-description-text">
            {alertDescription}
          </AlertDescription>
        </Alert>
      </Box>
    </Center>
  );
};
