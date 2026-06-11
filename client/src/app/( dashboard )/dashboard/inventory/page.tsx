"use client";

import SearchInput from "@/app/(components)/SearchInput";
import { useDebounce } from "@/hook/useDebounce";
import { useGetAllStockQuery } from "@/redux/features/product";
import { useState } from "react";
import Header from "../../(dashboardComponents)/Header";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import StocksModal from "../../(dashboardComponents)/StocksModal";

type Stock = {
  id: string;
  productName: string;
};

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockDetail, setStockDetail] = useState<Stock>({
    id: "",
    productName: "",
  });
  const debounceSearch = useDebounce({ value: searchTerm, delay: 500 });
  const {
    data: stocks,
    isLoading,
    refetch,
  } = useGetAllStockQuery({
    search: debounceSearch,
  });

  const cellCN = "text-xs md:text-base";
  const headerCN = "text-xs md:text-base font-semibold";

  const rows = stocks?.data.map((item) => ({
    id: item.id,
    productName: item.product?.name,
    category: item.product?.category,
    size: item.size,
    price: item.price,
    stock: item.stock,
  }));

  const columns: GridColDef[] = [
    {
      field: "productName",
      headerName: "Product",
      flex: 1,
      cellClassName: cellCN,
      headerClassName: headerCN,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      cellClassName: cellCN,
      headerClassName: headerCN,
    },
    {
      field: "size",
      headerName: "Size",
      width: 80,
      cellClassName: cellCN,
      headerAlign: "center",

      headerClassName: headerCN,
    },
    {
      field: "price",
      headerName: "Price",
      width: 80,
      cellClassName: cellCN,
      headerClassName: headerCN,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 80,
      cellClassName: cellCN,
      headerClassName: headerCN,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "id",
      headerName: "Controls",
      width: 140,
      sortable: false,
      cellClassName: cellCN,
      headerClassName: headerCN,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        return (
          <div className="flex items-center justify-center w-full h-full gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setStockDetail({
                  id: params.row.id,
                  productName: params.row.productName,
                });
                setIsModalOpen(true);
              }}
              className="bg-green-400 px-2 py-1 rounded-2xl cursor-pointer text-xs md:text-sm text-white font-semibold hover:bg-green-500 active:bg-green-600"
            >
              Stock
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log(params.row.id);
              }}
              className="bg-red-400 px-2 py-1 rounded-2xl cursor-pointer text-xs md:text-sm text-white font-semibold hover:bg-red-500 active:bg-red-600"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const content = (
    <>
      <main className="flex flex-col h-[85vh] min-h-[85vh]">
        <Header name="Inventory" />
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search Product"
          className="max-w-100"
        />

        <DataGrid
          rows={rows || []}
          columns={columns}
          getRowId={(row) => row.id || ""}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
            },
          }}
          className="shadow rounded-lg border border-gray-200 dark:border-gray-700 mt-5"
        />

        {isModalOpen && (
          <StocksModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            id={stockDetail.id}
            name={stockDetail.productName}
            refetch={refetch}
          />
        )}
      </main>
    </>
  );
  return content;
}
