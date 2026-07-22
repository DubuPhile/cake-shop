"use client";

import SearchInput from "@/app/(components)/SearchInput";
import { useDebounce } from "@/hook/useDebounce";
import {
  useDeleteSizeMutation,
  useGetAllStockQuery,
} from "@/redux/features/product";
import { useState } from "react";
import Header from "../../(dashboardComponents)/Header";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import StocksModal from "../../(dashboardComponents)/StocksModal";
import toast from "react-hot-toast";
import Confirmation from "@/app/(components)/Confirmation";
import { getStockStatus } from "@/lib/utilsFunction";

type Stock = {
  id: string;
  productName: string;
  size?: string;
};

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [stockDetail, setStockDetail] = useState<Stock>({
    id: "",
    productName: "",
  });
  const [deleteStock, setDeleteStock] = useState<Stock>({
    id: "",
    productName: "",
    size: "",
  });
  const debounceSearch = useDebounce({ value: searchTerm, delay: 500 });
  const {
    data: stocks,
    isLoading,
    refetch,
  } = useGetAllStockQuery({
    search: debounceSearch,
  });

  const [deleteSize] = useDeleteSizeMutation();

  const handleDeleteStock = async () => {
    try {
      await deleteSize(deleteStock.id).unwrap();
      toast.success(
        `${deleteStock.productName} ${deleteStock.size} has been Deleted`,
        {
          style: {
            fontWeight: "600",
            color: "green",
            textAlign: "center",
          },
        },
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to Delete pls try again later", {
        style: {
          fontWeight: "600",
          color: "red",
          textAlign: "center",
        },
      });
    }
  };

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
      minWidth: 150,
      cellClassName: cellCN,
      headerClassName: headerCN,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 100,
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
      width: 100,
      cellClassName: cellCN,
      headerClassName: headerCN,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value) =>
        new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(value),
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
      field: "status",
      headerName: "Status",
      width: 140,
      sortable: false,
      headerAlign: "center",
      align: "center",
      cellClassName: cellCN,
      headerClassName: headerCN,
      renderCell: (params) => {
        const status = getStockStatus(params.row.stock);

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        );
      },
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
                setDeleteStock({
                  id: params.row.id,
                  productName: params.row.productName,
                  size: params.row.size,
                });
                setConfirmModal(true);
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
        {confirmModal && (
          <Confirmation
            isOpen={confirmModal}
            onClose={() => setConfirmModal(false)}
            onConfirm={handleDeleteStock}
            Purpose="delete"
            name={`${deleteStock.productName + " " + deleteStock.size}`}
          />
        )}
      </main>
    </>
  );
  return content;
}
