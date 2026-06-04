import ReactTable from "@/components/organisms/reactTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

interface IDataTable {
  nameOfOrganization: string;
  origin: string;
  areaOfFocus: string;
  staff: number;
}

const PAGE_SIZE = 5;

const orgs: IDataTable[] = [
    {
        nameOfOrganization: "مبادرة أفق الصحة",
        origin: 'النصيرات',
        areaOfFocus: "الصحة",
        staff: 124
    },
    {
        nameOfOrganization: "إغاثة واحة المياه",
        origin: 'خانيونس',
        areaOfFocus: "المياه والصرف",
        staff: 89
    },
    {
        nameOfOrganization: "شبكة التغذية أولاً",
        origin: 'غزه - السرايا',
        areaOfFocus: "الغذاء",
        staff: 215
    },
    {
        nameOfOrganization: "وحدة الاستجابة العالمية",
        origin: 'شمال غزه',
        areaOfFocus: "عاجل",
        staff: 450
    },
]

const ActiveOrganization = () => {
  const [filteredName] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [dataTable, setDataTable] = useState<IDataTable[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDataTable(orgs)
  }, [])

  const filteredData = useMemo(() => {
    console.log("filterd name ", filteredName);
    return dataTable.filter((data) =>
      data.nameOfOrganization
        .toLowerCase()
        .includes(filteredName.toLowerCase()),
    );
  }, [filteredName, dataTable]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [pagination, filteredData]);

  const columns = useMemo<ColumnDef<IDataTable>[]>(() => {
    return [
      {
        header: "اسم المنظمة",
        accessorFn: (row) => `${row.nameOfOrganization}`,
      },
      {
        header: "المنطقة",
        accessorFn: (row) => `${row.origin}`,
      },
      {
        header: "مجال التركيز",
        accessorKey: "AreaOfFocus",
        cell: ({ row }) => {
          const { areaOfFocus } = row.original;
          return (
            <p
              className={`px-4 text-sm font-semibold border py-2 w-fit rounded-md ${
                areaOfFocus === "الصحة"
                  ? "bg-[#BBF7D0] border-[#15803D] text-[#15803D]"
                  : areaOfFocus === "المياه والصرف"
                    ? "bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8]"
                    : areaOfFocus === "الغذاء"
                      ? "bg-[#FFF7ED]] border-[#C2410C] text-[#C2410C]"
                      : areaOfFocus === "عاجل"
                        ? "bg-red-500 text-white"
                        : "bg-zinc-300 border-zinc-500"
                // areaOfFocus === "medical"
                //   ? "bg-[#BBF7D0]"
                //   : areaOfFocus === "water"
                //     ? "bg-[#EFF6FF]"
                //     : areaOfFocus === "food"
                //       ? "bg-[#FFF7ED]"
                //       : areaOfFocus === "urgent"
                //         ? "bg-red-500"
                //         : "bg-zinc-300"
              }`}
            >
              {areaOfFocus}
            </p>
          );
        },
      },
      {
        header: "طاقم العمل",
        accessorFn: (row) => row.staff,
      },
    ];
  }, []);

  return (
    <section className="flex flex-col rounded-lg border border-zinc-300">
      <article className="px-6 py-4 flex justify-between items-center gap-4 flex-wrap bg-primary/10">
        <p className="text-primary-foreground text-lg font-semibold">
          المنظمات المصغرة النشطة
        </p>
        <small className="text-primary">عرض جميع السجلات</small>
      </article>
      <article>
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

export default ActiveOrganization;
