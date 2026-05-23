"use client";

import { useGetUsersQuery } from "@/redux/features/adminAuth";
import Header from "@/app/( dashboard )/(dashboardComponents)/Header";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "User Name", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
];

export default function Users() {
  const { data: Users, isError, isLoading } = useGetUsersQuery();
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !Users) {
    return (
      <div className="text-center text-red-500 py-4">Failed to fetch Users</div>
    );
  }
  return (
    <main className="flex flex-col min-h-[90vh]">
      <Header name="Users" />
      <DataGrid
        rows={Users}
        columns={columns}
        getRowId={(row) => row.userId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 dark:border-gray-700 mt-5 text-gray-700!"
      />
    </main>
  );
}
