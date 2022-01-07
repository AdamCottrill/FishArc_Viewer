import React, { useState } from 'react';

import {
  IconButton,
  HStack,
  Input,
  InputGroup,
  FormControl,
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

export default function NabBarSearch() {
  const [projectLike, setProjectLike] = useState('');

  const handleSubmit = (e) => {
    console.log('Search term was:', projectLike);
    setProjectLike('');
  };

  return (
    <FormControl id="search" onSubmit={handleSubmit}>
      <HStack>
        <InputGroup size="sm" mt={1} mx={3}>
          <Input
            roundedLeft="full"
            roundedRight="0"
            width="20rem"
            type="text"
            placeholder="PRJ_CD like..."
            value={projectLike}
            onChange={(e) => setProjectLike(e.target.value)}
          />
          <IconButton
            roundedLeft="0"
            roundedRight="full"
            type="submit"
            onClick={handleSubmit}
            aria-label="search-projects-like"
            icon={<SearchIcon />}
          />
        </InputGroup>
      </HStack>
    </FormControl>
  );
}
