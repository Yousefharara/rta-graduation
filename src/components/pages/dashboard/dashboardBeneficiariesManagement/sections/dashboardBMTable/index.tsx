import ReactTable from "@/components/organisms/reactTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface IDataTable {
  beneficiaryName: string;
  idCard: string;
  familySize: number;
  algorithm: number;
}

const PAGE_SIZE = 5;

const orgs: IDataTable[] = [
  {
    beneficiaryName: "محمد علي",
    familySize: 8,
    idCard: "23425",
    algorithm: 99,
  },
  {
    beneficiaryName: "يوسف",
    algorithm: 80,
    familySize: 8,
    idCard: "23425",
  },
  {
    beneficiaryName: "احمد",

    algorithm: 20,

    familySize: 8,
    idCard: "23425",
  },
  {
    beneficiaryName: "ابراهيم",
    algorithm: 70,
    familySize: 8,
    idCard: "23425",
  },
];

const DashbaordBMTable = () => {
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const [dataTable, setDataTable] = useState<IDataTable[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDataTable(orgs);
  }, []);

  const filteredData = useMemo(() => {
    return dataTable.filter((item) => {
      const matchesSearch =
        item.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
        item.idCard.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [dataTable, search]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [pagination, filteredData]);

  const columns = useMemo<ColumnDef<IDataTable>[]>(() => {
    return [
      {
        header: "اسم المستفيد",
        accessorFn: (row) => `${row.beneficiaryName}`,
      },
      {
        header: "الرقم التعريفي",
        accessorFn: (row) => `${row.idCard}`,
      },
      {
        header: "حجم العائلة",
        accessorKey: "familySize",
        cell: ({row}) => {
            const {familySize} = row.original;
            return(
                <p>{familySize} أفراد</p>
            )
        }
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

              {algorithm}
            </p>
          );
        },
      },

      {
        header: "الاجراءات",
        cell: () => {
          return (
            <Eye strokeWidth={1.3} className="text-primary cursor-pointer" />
          );
        },
      },
    ];
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-2 items-center border border-zinc-400 rounded-md px-3 py-2">
        <Search size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-64 outline-0"
          placeholder="بحث عن اسم أو الرقم التعريفي..."
        />
      </div>

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

export default DashbaordBMTable;
