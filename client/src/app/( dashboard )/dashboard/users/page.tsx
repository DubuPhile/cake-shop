"use client";

import { useGetUsersQuery } from "@/redux/features/adminAuth";
import Header from "@/app/( dashboard )/(dashboardComponents)/Header";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import Default from "../../../../../public/default-avatar.png";

import SearchInput from "@/app/(components)/SearchInput";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hook/useDebounce";
import Spinner from "@/app/(components)/Spinner";

const cellCN = "text-xs md:text-base";
const headerCN = "text-xs md:text-base ";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce({ value: searchTerm, delay: 300 });
  const { data: Users, isError, isLoading } = useGetUsersQuery(debounceSearch);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "userId",
        headerName: "ID",
        width: 90,
        cellClassName: cellCN,
        headerClassName: headerCN,
      },
      {
        field: "avatar",
        headerName: "Avatar",
        width: 70,
        sortable: false,
        headerClassName: headerCN,
        renderCell: (params) => (
          <div className="flex items-center justify-center w-full h-full">
            <Image
              src={params.row.avatar || Default}
              alt={params.row.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
          </div>
        ),
      },
      {
        field: "name",
        headerName: "Username",
        width: 150,
        cellClassName: cellCN,
        headerClassName: headerCN,
      },
      {
        field: "email",
        headerName: "Email",
        width: 200,
        cellClassName: cellCN,
        headerClassName: headerCN,
      },
      {
        field: "isAdmin",
        headerName: "Controls",
        width: 100,
        sortable: false,
        headerClassName: headerCN,
        renderCell: (params) => {
          return params.row.roles === "ADMIN" ? (
            ""
          ) : (
            // add isBlock here for true and false
            <div className="flex items-center justify-center w-full h-full">
              <button className="bg-red-400 px-2 py-1 rounded-2xl cursor-pointer text-sm text-white font-semibold hover:bg-red-500 active:bg-red-600">
                Block
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <main className="flex flex-col h-[85vh] min-h-[85vh]">
      <Header name="Users" />
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search user..."
        className="max-w-100"
      />
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div className="text-center text-red-500 py-4">
          Failed to fetch Users
        </div>
      ) : (
        <DataGrid
          rows={Users ?? []}
          columns={columns}
          getRowId={(row) => row.userId}
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 dark:border-gray-700 mt-5 text-gray-700!"
        />
      )}
    </main>
  );
}
