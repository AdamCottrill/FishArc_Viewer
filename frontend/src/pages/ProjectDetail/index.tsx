import { FC } from "react";
import { Box, Container } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import MySpinner from "../../components/MySpinner";
import { getProjectDetail } from "../../services/api";

import { FN011 } from "./FN011";
import { FN012 } from "./FN012";
import { FN022 } from "./FN022";
import { FN023 } from "./FN023";
//import { FN024 } from "./FN024";
import { FN025 } from "./FN025";
import { FN026 } from "./FN026";
import { FN028 } from "./FN028";
import { FN013 } from "./FN013";

export default function ProjectDetail() {
  let { source, prj_cd } = useParams();

  const { data, error, isLoading, isFetching } = useQuery(
    ["project_detail", source, prj_cd],
    () => getProjectDetail(source, prj_cd)
  );

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading || isFetching) {
    const spinnerMessage = `Fetching Projects`;
    return <MySpinner message={spinnerMessage} />;
  }

  return (
    <div>
      {data && (
        <>
          <Container maxW="container.xl">
            <FN011 source={source} project={data.fn011} />
            <FN012 data={data.fn012} />
            <Box my={4} maxW="container.xl" borderWidth="1px" borderRadius="lg">
              <FN022 data={data.fn022} />
              <FN023 fn023={data.fn023} fn024={data.fn024} />
              <FN025 data={data.fn025} />
            </Box>

            <Container
              my={4}
              maxW="container.xl"
              borderWidth="1px"
              borderRadius="lg"
            >
              <FN026 data={data.fn026} />
            </Container>
            <Container
              my={4}
              maxW="container.xl"
              borderWidth="1px"
              borderRadius="lg"
            >
              <FN028 data={data.fn028} />
              <FN013 fn013={data.fn013} fn014={data.fn014} />
            </Container>
          </Container>
        </>
      )}
    </div>
  );
}
