import type { AidCategoryType } from "@/@types/aid";
import type { AidStatusType } from "@/@types/userAids";
import ReactTable from "@/components/organisms/reactTable";
import { type ColumnDef } from "@tanstack/react-table";
import { Archive } from "lucide-react";
import { useMemo, useState } from "react";

interface IDataTable {
  name: AidCategoryType | "";
  date: string;
  pickupLocation: string;
  status: AidStatusType;
}

const PAGE_SIZE = 5;

const TrackAidUserTableAids = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [dataTable] = useState<IDataTable[]>([]);

  // useEffect(() => {
  //   dispatch(getAids());
  //   dispatch(getUserAids());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (!loadingAids && !loadingUserAids && user) {
  //     const result: IDataTable[] = userAids
  //       .filter((ua) => {
  //         return ua.user_id == user;
  //       })
  //       .map((userAid) => {
  //         const aid = aids.find((aid) => aid.id == userAid.aid_id);

  //         return {
  //           name: aid?.category || "",
  //           date: "10/10/2025",
  //           pickupLocation: "غزة",
  //           status: userAid.status,
  //         };
  //       });

  //     // eslint-disable-next-line react-hooks/set-state-in-effect
  //     setDataTable(result);
  //   }
  // }, [aids, loadingAids, loadingUserAids, user, userAids]);


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
                ? "تم الاستلام"
                : status === "pending"
                  ? "قيد المراجعه"
                  : status === "rejected"
                    ? "مرفوضه"
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
            2
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
