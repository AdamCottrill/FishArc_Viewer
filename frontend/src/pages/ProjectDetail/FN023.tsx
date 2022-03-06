import { FC, useMemo } from "react";
import { Container, Heading } from "@chakra-ui/react";
import SortableTable from "../../components/SortableTable";

export const FN023 = ({ fn023, fn024 }): JSX.Element => {
  let data;

  if (fn023) {
    data = fn023.map(function (dt) {
      return { ...dt, periods: fn024.filter((x) => x.DTP === dt.DTP) };
    });
  } else {
    data = fn023;
  }

  const FN023Detail = ({ daytype }) => {
    const columns = useMemo(
      () => [
        {
          Header: "Period",
          accessor: "PRD",
        },
        {
          Header: "Start Time",
          accessor: "PRDTM0",
        },
        {
          Header: "End Time",
          accessor: "PRDTM1",
        },
        {
          Header: "Durtation",
          accessor: "PRD_DUR",
        },
        {
          Header: "Weight",
          accessor: "TIME_WT",
        },
      ],
      []
    );

    return (
      <>
        <Heading align="left" size="sm" my={4}>
          {daytype.DTP_NM} ({daytype.DTP}) [dow:{daytype.DOW_LST}]
        </Heading>
        {daytype?.periods && (
          <SortableTable columns={columns} data={daytype.periods} />
        )}
      </>
    );
  };
  return (
    <Container maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        Day Types and Periods (FN023 and FN024)
      </Heading>
      {data.length ? (
        data.map((daytype, id) => <FN023Detail key={id} daytype={daytype} />)
      ) : (
        <p>No Daytypes Defined</p>
      )}
    </Container>
  );
};
