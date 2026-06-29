import { Check, CircleCheck, CircleX, Eye, Search, X, Truck, Package } from "lucide-react";
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
import { editBeneficiaryAidStatus, getBeneficiaryAids } from "@/redux/slices/beneficiaryAidSlice";
import { getBeneficiaries } from "@/redux/slices/beneficiarySlice";
import { getPickupLocations } from "@/redux/slices/pickupLocationSlice";
import type { IBeneficiaryOrder } from "@/@types/beneficiaryOrder";
import type { IBeneficiaryAid } from "@/@types/beneficiaryAid";
import Spinner from "@/components/feedback/Spinner";
import Error from "@/components/feedback/Error";

type orderAidStatus = "pending" | "approved" | "rejected";

interface TableProps {
  statusFilter: "all" | orderAidStatus;
  setStatusFilter: (s: "all" | orderAidStatus) => void;
}

const PAGE_SIZE = 5;

const DashboardAidOrdersTable = ({ statusFilter, setStatusFilter }: TableProps) => {
  const [search, setSearch] = useState("");

  const { translate } = useTranslate();

  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { orders, isFetching, isUpdating, error } = useAppSelector(
    (state) => state.beneficiaryOrders,
  );
  const { aids } = useAppSelector((state) => state.beneficiaryAids);
  const { beneficiaries } = useAppSelector((state) => state.beneficiaries);
  const { pickupLocations } = useAppSelector((state) => state.pickupLocations);

  useEffect(() => {
    if (accessToken) {
      if (orders.length === 0) dispatch(getBeneficiaryOrders(accessToken));
      if (aids.length === 0) dispatch(getBeneficiaryAids(accessToken));
      if (beneficiaries.length === 0) dispatch(getBeneficiaries(accessToken));
      if (pickupLocations.length === 0) dispatch(getPickupLocations(accessToken));
    }
  }, [dispatch, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

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

  /** Find pickup location whose area_id matches the beneficiary's area_id */
  const resolvePickupLocationId = (beneficiaryId: number): number | undefined => {
    const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId);
    if (!beneficiary) return undefined;
    const location = pickupLocations.find((loc) => loc.area_id === beneficiary.area_id);
    return location?.id;
  };

  const handleUpdateStatus = (
    id: number,
    status: IBeneficiaryOrder["status"],
    beneficiaryId?: number,
  ) => {
    let pickupLocationId: number | undefined;
    if (status === "approved" && beneficiaryId) {
      pickupLocationId = resolvePickupLocationId(beneficiaryId);
    }
    dispatch(updateBeneficiaryOrderStatusAction(id, status, accessToken || "", pickupLocationId));
  };

  const columns = useMemo<ColumnDef<IBeneficiaryOrder>[]>(() => {
    return [
      {
        header: "رقم الطلب",
        cell: ({ row }) => (
          <p className="text-primary font-medium">#{row.original.id}</p>
        ),
      },
      {
        header: "رقم المستفيد",
        cell: ({ row }) => <p>{row.original.beneficiary_id}</p>,
      },
      {
        header: "نوع المساعده",
        cell: ({ row }) => (
          <p className="px-4 text-sm font-semibold border border-zinc-400 py-2 w-fit rounded-md">
            {translate(String(row.original.aid_type_id))}
          </p>
        ),
      },
      {
        header: "الوصف",
        cell: ({ row }) => (
          <p className="max-w-[200px] truncate text-sm text-zinc-600">
            {row.original.description}
          </p>
        ),
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
        header: "حالة المساعدة",
        cell: ({ row }) => {
          const aid = aids.find((a) => a.order_id === row.original.id);
          if (!aid) return <span className="text-zinc-400">-</span>;

          const { status, id } = aid;

          const statusLabels: Record<string, string> = {
            approved: "تمت الموافقة",
            preparing: "جاري التجهيز",
            shipping: "جاري التوزيع",
            delivered: "تم التوصيل",
            rejected: "مرفوض",
          };

          const handleStatusClick = (newStatus: IBeneficiaryAid['status']) => {
            if (isUpdating) return;
            dispatch(editBeneficiaryAidStatus(id, newStatus, accessToken || ""));
          };

          return (
            <div className="flex flex-col gap-1 items-start">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                {statusLabels[status] || status}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {status === "approved" && (
                  <button
                    title="تحضير المساعدة"
                    disabled={isUpdating}
                    onClick={() => handleStatusClick("preparing")}
                    className="p-1 hover:bg-yellow-50 rounded transition-colors text-yellow-600 hover:text-yellow-700 disabled:opacity-40 cursor-pointer"
                  >
                    <Package size={18} />
                  </button>
                )}

                {(status === "approved" || status === "preparing") && (
                  <button
                    title="شحن المساعدة"
                    disabled={isUpdating}
                    onClick={() => handleStatusClick("shipping")}
                    className="p-1 hover:bg-blue-50 rounded transition-colors text-blue-600 hover:text-blue-700 disabled:opacity-40 cursor-pointer"
                  >
                    <Truck size={18} />
                  </button>
                )}

                {(status === "approved" || status === "preparing" || status === "shipping") && (
                  <button
                    title="توصيل المساعدة"
                    disabled={isUpdating}
                    onClick={() => handleStatusClick("delivered")}
                    className="p-1 hover:bg-green-50 rounded transition-colors text-green-600 hover:text-green-700 disabled:opacity-40 cursor-pointer"
                  >
                    <CircleCheck size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        },
      },
      {
        header: "الاجراءات",
        cell: ({ row }) => {
          const { status, id, beneficiary_id } = row.original;

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
                    onClick={() => handleUpdateStatus(id, "approved", beneficiary_id)}
                    className="cursor-pointer disabled:opacity-40"
                  >
                    <CircleCheck size={22} strokeWidth={1.3} className="text-green-700" />
                  </button>

                  <button
                    title="رفض الطلب"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(id, "rejected")}
                    className="cursor-pointer disabled:opacity-40"
                  >
                    <CircleX size={22} strokeWidth={1.3} className="text-red-700" />
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdating, translate, aids, accessToken, dispatch, beneficiaries, pickupLocations]);

  if (isFetching) {
    return (
      <div className="flex justify-center gap-4 items-center h-40 text-zinc-500">
        جاري تحميل الطلبات...
          <Spinner />

      </div>
    );
  }

  
    if(error) return <Error onRetry={() => dispatch(getBeneficiaryOrders(accessToken || ""))}/>

  return (
    <section className="flex flex-col gap-4 p-3 border border-zinc-400 bg-white rounded-md">
      <article className="flex items-center gap-4 flex-wrap">
        <div className="search-filter bg-[#EFF4FF] rounded-md px-4 py-2 flex flex-wrap items-center gap-2">
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
              statusFilter === "approved" ? "bg-primary text-white" : "bg-white"
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

        <div className="flex gap-2 basis-[48%] items-center border border-zinc-400 rounded-md px-3 py-2">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-0"
            placeholder="بحث عن رقم الطلب أو رقم المستفيد..."
          />
        </div>
      </article>

      <article className="w-full overflow-x-auto">
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
