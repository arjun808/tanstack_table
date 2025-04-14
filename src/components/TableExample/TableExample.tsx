import UsersTable from "../UsersTable";

export const TableExamples: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">DataTable Component Examples</h1>
      <UsersTable />
    </div>
  );
};

export default TableExamples;
