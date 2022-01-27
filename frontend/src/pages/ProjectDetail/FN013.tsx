import React, { FC, useMemo } from "react";
import { Container, Heading } from "@chakra-ui/react";

import SortableTable from "../../components/SortableTable";

export function FN013({ fn013, fn014 }): FC {
  let data;

  if (fn013) {
    data = fn013.map(function (gr) {
      return { ...gr, subgear: fn014.filter((x) => x.GR === gr.GR) };
    });
  } else {
    data = fn013;
  }

  const GearDetail = ({ gear }) => {
    const columns = useMemo(
      () => [
        {
          Header: "EFF",
          accessor: "EFF",
        },
        {
          Header: "EFF Description",
          accessor: "EFF_DES",
        },
        {
          Header: "Mesh Size",
          accessor: "MESH",
        },
        {
          Header: "Length",
          accessor: "GRLEN",
        },
        {
          Header: "Height",
          accessor: "GRHT",
        },

        {
          Header: "Width",
          accessor: "GRWID",
        },

        {
          Header: "Colour",
          accessor: "GRCOL",
        },

        {
          Header: "Material",
          accessor: "GRMAT",
        },

        {
          Header: "Yarn",
          accessor: "GRYAR",
        },

        {
          Header: "KNOT",
          accessor: "GRKNOT",
        },
      ],
      []
    );

    return (
      <>
        <Heading py={3} align="left" size="sm" my={4}>
          {gear.GR}: {gear.EFFDST ? `${gear.EFFDST} m ` : null} {gear.GR_DES}
        </Heading>

        {gear?.subgear && (
          <SortableTable columns={columns} data={gear.subgear} />
        )}
      </>
    );
  };

  return (
    <Container py={2} maxW="container.xl">
      <Heading align="left" size="md" my={4}>
        Fishing Gears (FN013)
      </Heading>
      {data.length ? (
        data.map((gear, id) => <GearDetail key={id} gear={gear} />)
      ) : (
        <p>No Gear Information Provided</p>
      )}
    </Container>
  );
}
