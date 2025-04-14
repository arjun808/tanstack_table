import { useMemo } from "react";
import { DataTable } from "../DataTable.tsx/DataTable";
import { userData, userTableColumns } from "./userTable.config";

const UsersTable = () => {
  const USER_DATA = useMemo(() => userData(), []);
  const USER_COLUMNS = useMemo(() => userTableColumns(), []);

  return (
    <div className="mb-16">
      <h2 className="text-xl font-bold mb-4">Users Management</h2>
      <DataTable
        data={USER_DATA}
        columns={USER_COLUMNS}
        showPagination={true}
        showGlobalFilter={true}
        enableRowSelection={true}
      />
    </div>
  );
};
export default UsersTable;
