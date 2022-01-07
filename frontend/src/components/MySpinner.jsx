import { Flex, VStack, Heading, Spinner } from '@chakra-ui/react';

const MySpinner = ({ message }) => {
  return (
    <Flex>
      <VStack mt="20px" flex="1" spacing="25px">
        <Heading as="h4" size="md">
          <em>{message}</em>
        </Heading>
        <Spinner size="xl" />
      </VStack>
    </Flex>
  );
};

export default MySpinner;
