import { Check, CircleCheck, CircleX, Eye, Search, X } from "lucide-react";
import "./style.css";
import ReactTable from "@/components/organisms/reactTable";
import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "@/hooks/useTranslate";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  getBeneficiaryOrders,
  updateBeneficiaryOrderStatusAction,
} from "@/redux/slices/beneficiaryOrderSlice";
import type { IBeneficiaryOrder } from "@/@types/beneficiaryOrder";

type orderAidStatus = "pending" | "approved" | "rejected";

const PAGE_SIZE = 5;

const DashboardAidOrdersTable = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | orderAidStatus>(
    "all",
  );

  const { translate } = useTranslate();

  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { orders, isFetching, isUpdating } = useAppSelector(
    (state) => state.beneficiaryOrders,
  );

  useEffect(() => {
    dispatch(getBeneficiaryOrders(accessToken || ""));
  }, [dispatch, accessToken]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const filteredData = useMemo(() => {
    return orders.filter((item) => {
      const matchesSearch =
        String(item.id).includes(search) ||
        String(item.beneficiary_id).includes(search);

      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [pagination, filteredData]);

  const handleUpdateStatus = (id: number, status: IBeneficiaryOrder["status"]) => {
    dispatch(updateBeneficiaryOrderStatusAction(id, status, accessToken || ""));
  };

  const columns = useMemo<ColumnDef<IBeneficiaryOrder>[]>(() => {
    return [
      {
        header: "رقم الطلب",
        cell: ({ row }) => {
          return (
            <p className="text-primary font-medium">#{row.original.id}</p>
          );
        },
      },
      {
        header: "رقم المستفيد",
        cell: ({ row }) => {
          return <p>{row.original.beneficiary_id}</p>;
        },
      },
      {
        header: "نوع المساعده",
        cell: ({ row }) => {
          return (
            <p className="px-4 text-sm font-semibold border border-zinc-400 py-2 w-fit rounded-md">
              {translate(String(row.original.aid_type_id))}
            </p>
          );
        },
      },
      {
        header: "الوصف",
        cell: ({ row }) => {
          return (
            <p className="max-w-[200px] truncate text-sm text-zinc-600">
              {row.original.description}
            </p>
          );
        },
      },
      {
        header: "الحالة",
        cell: ({ row }) => {
          const { status } = row.original;

          if (status === "pending") {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                قيد الانتظار
              </span>
            );
          }

          if (status === "approved") {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <Check size={12} />
                موافق عليه
              </span>
            );
          }

          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              <X size={12} />
              مرفوض
            </span>
          );
        },
      },
      {
        header: "الاجراءات",
        cell: ({ row }) => {
          const { status, id } = row.original;

          return (
            <div className="flex items-center gap-3">
              <button
                title="عرض التفاصيل"
                className="text-primary hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Eye strokeWidth={1.3} size={20} />
              </button>

              {status === "pending" && (
                <>
                  <button
                    title="قبول الطلب"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(id, "approved")}
                    className="cursor-pointer disabled:opacity-40"
                  >
                    <CircleCheck
                      size={22}
                      strokeWidth={1.3}
                      className="text-green-700"
                    />
                  </button>

                  <button
                    title="رفض الطلب"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(id, "rejected")}
                    className="cursor-pointer disabled:opacity-40"
                  >
                    <CircleX
                      size={22}
                      strokeWidth={1.3}
                      className="text-red-700"
                    />
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdating, translate]);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-40 text-zinc-500">
        جاري تحميل الطلبات...
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4 p-3 border border-zinc-400 bg-white rounded-md">
      <article className="flex items-center gap-4">
        <div className="search-filter bg-[#EFF4FF] rounded-md px-4 py-2 flex items-center gap-2">
          <p
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-2 rounded-md cursor-pointer ${
              statusFilter === "all" ? "bg-primary text-white" : "bg-white"
            }`}
          >
            الكل
          </p>

          <p
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-2 rounded-md cursor-pointer ${
              statusFilter === "pending" ? "bg-primary text-white" : "bg-white"
            }`}
          >
            قيد الانتظار
          </p>

          <p
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-2 rounded-md cursor-pointer ${
              statusFilter === "approved"
                ? "bg-primary text-white"
                : "bg-white"
            }`}
          >
            تمت الموافقة
          </p>

          <p
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-2 rounded-md cursor-pointer ${
              statusFilter === "rejected" ? "bg-primary text-white" : "bg-white"
            }`}
          >
            مرفوض
          </p>
        </div>

        <div className="flex gap-2 items-center border border-zinc-400 rounded-md px-3 py-2">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-64 outline-0"
            placeholder="بحث عن رقم الطلب أو رقم المستفيد..."
          />
        </div>
      </article>

      <article className="w-full">
        <ReactTable
          columns={columns}
          data={paginationData}
          onPaginationChange={setPagination}
          pagination={pagination}
          pageCount={pageCount}
        />
      </article>
    </section>
  );
};

export default DashboardAidOrdersTable;
