import { DataTable } from "@/components/view/DataTable";
import React from "react";
import dummyData from "./dummy.json";
import { columns } from "./column";

const PromptsTable = () => {
  return <DataTable data={dummyData} columns={columns} />;
};

export default PromptsTable;
