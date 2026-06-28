import ReactTable from "@/components/organisms/reactTable";
import { type ColumnDef } from "@tanstack/react-table";
import { Archive } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getBeneficiaryAids } from "@/redux/slices/beneficiaryAidSlice";
import { getAidTypes } from "@/redux/slices/aidTypes";

interface IDataTable {
  name: string;
  date: string;
  pickupLocation: string;
  status: string;
}

const PAGE_SIZE = 5;

const TrackAidUserTableAids = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const dispatch = useAppDispatch();
  const { aids } = useAppSelector((state) => state.beneficiaryAids);
  const { aidTypes } = useAppSelector((state) => state.aidTypes);
  const { beneficiary, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      dispatch(getBeneficiaryAids(accessToken));
      dispatch(getAidTypes(accessToken));
    }
  }, [dispatch, accessToken]);

  const filteredAids = useMemo(() => {
    if (!beneficiary) return [];
    return aids.filter((aid) => aid.beneficiary_id === beneficiary.id);
  }, [aids, beneficiary]);

  const dataTable = useMemo<IDataTable[]>(() => {
    return filteredAids.map((aid) => {
      const aidTypeObj = aidTypes.find((t) => Number(t.id) === aid.aid_type_id);
      const name = aidTypeObj ? aidTypeObj.name : `Aid Type #${aid.aid_type_id}`;
      return {
        name,
        date: "",
        pickupLocation: aid.pickup_location_id ? `Location #${aid.pickup_location_id}` : "غزة",
        status: aid.status,
      };
    });
  }, [filteredAids, aidTypes]);

  const deliveredAidsCount = useMemo(() => {
    return filteredAids.filter((aid) => aid.status === "delivered").length;
  }, [filteredAids]);

  const pageCount = Math.ceil(dataTable.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return dataTable.slice(start, end);
  }, [pagination, dataTable]);

  const columns = useMemo<ColumnDef<IDataTable>[]>(() => {
    return [
      {
        header: "نوع المساعده",
        // accessorFn: (row) => `${row.name}`,
        accessorKey: "name",
        cell: ({ row }) => {
          const { name } = row.original;
          return (
            <div>
              {name === "Cash"
                ? "مساعده نقديه"
                : name === "Food Assistance"
                  ? "مساعده غذائيه"
                  : name === "Medical Support"
                    ? "مساعده طبيه"
                    : name}
            </div>
          );
        },
      },
      {
        header: "التاريخ",
        accessorFn: (row) => `${row.date}`
      },
      {
        header: "مكان الاستلام",
        accessorKey: "pickupLocation",
        cell: ({ row }) => {
          const { pickupLocation } = row.original;
          return <>{pickupLocation}</>;
        },
      },
      {
        header: "الحالة",
        accessorKey: "status",
        cell: ({ row }) => {
          const { status } = row.original;
          return (
            <p className="px-4 text-sm font-semibold py-2 bg-muted text-secondary w-fit rounded-md">
              {status === "approved"
                ? "تمت الموافقة"
                : status === "preparing"
                  ? "جاري التجهيز"
                  : status === "shipping"
                    ? "جاري التوزيع"
                    : status === "delivered"
                      ? "تم التوصيل"
                      : status === "rejected"
                        ? "مرفوضة"
                        : status}
            </p>
          );
        },
      },
    ];
  }, []);

  return (
    <section className="flex flex-col gap-8 rounded-lg px-8 py-6 bg-white border border-zinc-300 ">
      <article className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Archive className="text-primary" size={18} />
          <p>سجل المساعدات المستلمة</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/20 p-4 rounded-lg">
          <div className="text-secondary font-medium rounded-full border-2 border-secondary text-center flex justify-center items-center w-6 h-6 ">
            {deliveredAidsCount}
          </div>
          <p>إجمالي الدورات المستلمة</p>
        </div>
      </article>
      <ReactTable
        columns={columns}
        data={paginationData}
        onPaginationChange={setPagination}
        pagination={pagination}
        pageCount={pageCount}
      />
    </section>
  );
};

export default TrackAidUserTableAids;
