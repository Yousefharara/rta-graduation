import { CircleCheck, CircleX, Eye, Search, X } from "lucide-react";
import "./style.css";
import ReactTable from "@/components/organisms/reactTable";
import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "@/hooks/useTranslate";

type orderAidStatus = "agreement" | "rejected" | "pending";
type aidCategoryType =
  | "Food"
  | "Medical"
  | "Financial"
  | "Clothing"
  | "Shelter"
  | "Educational";

interface IDataTable {
  orderNum: string;
  beneficiaryName: string;
  aidCategory: aidCategoryType;
  algorithm: number;
  status: orderAidStatus;
}

const PAGE_SIZE = 5;

const orgs: IDataTable[] = [
  {
    orderNum: "#AID-8842",
    beneficiaryName: "محمد علي",
    aidCategory: "Financial",
    algorithm: 99,
    status: "agreement",
  },
  {
    orderNum: "#AID-8843",
    beneficiaryName: "يوسف",
    aidCategory: "Food",
    algorithm: 80,
    status: "pending",
  },
  {
    orderNum: "#AID-8844",
    beneficiaryName: "احمد",
    aidCategory: "Food",
    algorithm: 20,
    status: "agreement",
  },
  {
    orderNum: "#AID-8845",
    beneficiaryName: "ابراهيم",
    aidCategory: "Financial",
    algorithm: 70,
    status: "rejected",
  },
];

const DashboardAidOrdersTable = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | orderAidStatus>(
    "all",
  );

  const { translate } = useTranslate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [dataTable, setDataTable] = useState<IDataTable[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDataTable(orgs);
  }, []);

  const updateOrderStatus = (orderNumber: string, status: orderAidStatus) => {
    setDataTable((prev) =>
      prev.map((item) =>
        item.orderNum === orderNumber ? { ...item, status } : item,
      ),
    );
  };

  const filteredData = useMemo(() => {
    return dataTable.filter((item) => {
      const matchesSearch =
        item.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderNum.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [dataTable, search, statusFilter]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [pagination, filteredData]);

  const columns = useMemo<ColumnDef<IDataTable>[]>(() => {
    return [
      {
        header: "رقم الطلب",
        accessorKey: "orderNum",
        cell: ({ row }) => {
          const { orderNum } = row.original;
          return <p className="text-primary font-medium">{orderNum}</p>;
        },
      },
      {
        header: "اسم المستفيد",
        accessorFn: (row) => `${row.beneficiaryName}`,
      },
      {
        header: "نوع المساعده",
        accessorKey: "aidCategory",
        cell: ({ row }) => {
          const { aidCategory } = row.original;
          return (
            <p
              className={`px-4 text-sm font-semibold border border-zinc-400 py-2 w-fit rounded-md`}
            >
              {translate(aidCategory)}
            </p>
          );
        },
      },
      {
        header: "الأولويه (الخوارزميه)",
        accessorKey: "algorithm",
        cell: ({ row }) => {
          const { algorithm } = row.original;
          return (
            <p className="flex items-center gap-2">
              

              <div className="relative h-2 w-15">
                {/* الخلفية */}
                <div className="absolute inset-0 bg-zinc-200 rounded-md" />

                {/* الشريط */}
                <div
                  style={{
                    background: `linear-gradient(
                                to left,
                                ${algorithm > 90 ? "red" : algorithm > 70 ? "orange" : algorithm > 50 ? "blue" : "green"} 0%,
                                ${algorithm > 90 ? "red" : algorithm > 70 ? "orange" : algorithm > 50 ? "blue" : "green"} ${algorithm}%,
                                transparent ${algorithm}%,
                                transparent 100%
                            )`,
                  }}
                  className="absolute inset-0 rounded-md z-10"
                />
              </div>
              
              
              {algorithm > 90
                ? "حرجه"
                : algorithm > 70
                  ? "عاليه"
                  : algorithm > 50
                    ? "متوسطه"
                    : "عاديه"}
            </p>
          );
        },
      },

      {
        header: "الاجراءات",
        cell: ({ row }) => {
          const { status, orderNum } = row.original;

          return (
            <div className="flex items-center gap-3">
              {status === "agreement" ? (
                <Eye
                  strokeWidth={1.3}
                  className="text-primary cursor-pointer"
                />
              ) : status === "rejected" ? (
                <X size={25} className="text-red-700" />
              ) : (
                <>
                  <CircleCheck
                    size={25}
                    strokeWidth={1.3}
                    className="text-green-700 cursor-pointer"
                    onClick={() => updateOrderStatus(orderNum, "agreement")}
                  />

                  <CircleX
                    size={25}
                    strokeWidth={1.3}
                    className="text-red-700 cursor-pointer"
                    onClick={() => updateOrderStatus(orderNum, "rejected")}
                  />
                </>
              )}
            </div>
          );
        },
      },
    ];
  }, [translate]);

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
            onClick={() => setStatusFilter("agreement")}
            className={`px-3 py-2 rounded-md cursor-pointer ${
              statusFilter === "agreement"
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
            placeholder="بحث عن اسم أو رقم الطلب..."
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
